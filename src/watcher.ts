import { FolderConfig, LogEntry, RenameResult } from "./types.ts";
import { ClaudeClient } from "./claude.ts";

/** ファイル監視＆リネームエンジン */
export class FileWatcher {
  private watchers: Map<string, Deno.FsWatcher> = new Map();
  private claudeClient: ClaudeClient | null = null;
  private processing: Set<string> = new Set(); // 処理中ファイルの重複防止
  private onLog: (entry: LogEntry) => void;
  private onRename: (result: RenameResult) => void;
  private maxFilenameLength: number;

  constructor(
    onLog: (entry: LogEntry) => void,
    onRename: (result: RenameResult) => void,
    maxFilenameLength: number = 40
  ) {
    this.onLog = onLog;
    this.onRename = onRename;
    this.maxFilenameLength = maxFilenameLength;
  }

  /** Claude APIクライアントをセット */
  setClient(client: ClaudeClient) {
    this.claudeClient = client;
  }

  /** 最大ファイル名長を更新 */
  setMaxFilenameLength(len: number) {
    this.maxFilenameLength = Math.max(20, Math.min(80, len));
  }

  /** フォルダの監視を開始 */
  async startWatching(folders: FolderConfig[]): Promise<void> {
    this.stopWatching();

    for (const folder of folders) {
      if (!folder.enabled) continue;

      try {
        // フォルダの存在確認
        const stat = await Deno.stat(folder.path);
        if (!stat.isDirectory) {
          this.log("error", `パスがフォルダではありません: ${folder.path}`);
          continue;
        }

        const watcher = Deno.watchFs(folder.path);
        this.watchers.set(folder.path, watcher);

        // 非同期でイベントを監視
        this.watchLoop(watcher, folder);

        this.log("success", `監視開始: ${folder.path}`);
      } catch (e) {
        this.log("error", `監視開始失敗: ${folder.path} - ${e}`);
      }
    }
  }

  /** 監視ループ */
  private async watchLoop(watcher: Deno.FsWatcher, folder: FolderConfig) {
    try {
      for await (const event of watcher) {
        if (event.kind === "create" || event.kind === "modify") {
          for (const path of event.paths) {
            if (path.toLowerCase().endsWith(".pdf")) {
              // 少し待ってからの処理（ファイル書き込み完了を待つ）
              this.scheduleProcessing(path, folder);
            }
          }
        }
      }
    } catch (e) {
      // watcher がクローズされた場合は正常終了
      if (e instanceof Deno.errors.BadResource) return;
      this.log("error", `監視エラー: ${folder.path} - ${e}`);
    }
  }

  /** ファイル処理をスケジュール（debounce） */
  private scheduleProcessing(filePath: string, folder: FolderConfig) {
    if (this.processing.has(filePath)) return;
    this.processing.add(filePath);

    setTimeout(async () => {
      try {
        await this.processFile(filePath, folder);
      } finally {
        this.processing.delete(filePath);
      }
    }, 3000); // 3秒待機（スキャナーの書き込み完了を待つ）
  }

  /** PDFファイルを処理してリネーム */
  private async processFile(filePath: string, folder: FolderConfig) {
    const filename = filePath.split(/[/\\]/).pop() || filePath;

    try {
      // ファイルの存在確認
      try {
        await Deno.stat(filePath);
      } catch {
        this.log("warning", `ファイルが見つかりません: ${filename}`);
        return;
      }

      // ファイルが読み取り可能か確認（書き込み中でないか）
      if (!(await this.isFileReady(filePath))) {
        this.log("warning", `ファイルが使用中です（スキップ）: ${filename}`);
        return;
      }

      if (!this.claudeClient) {
        this.log("error", "APIキーが設定されていません");
        return;
      }

      this.log("info", `🔄 処理開始: ${filename}`);

      // Claude APIでドキュメント名を生成
      const documentName = await this.claudeClient.generateDocumentName(
        filePath,
        folder
      );

      // ファイル名を制限長に収める
      const truncatedName = this.truncateFilename(documentName);

      // リネーム実行
      const result = await this.renameFile(filePath, truncatedName);
      this.onRename(result);

      if (result.success) {
        const newFilename = result.newPath.split(/[/\\]/).pop() || "";
        this.log("success", `✅ ${filename} → ${newFilename}`);
      } else {
        this.log("error", `❌ リネーム失敗: ${filename} - ${result.error}`);
      }
    } catch (e) {
      this.log("error", `❌ 処理エラー: ${filename} - ${e}`);
      this.onRename({
        originalPath: filePath,
        newPath: "",
        documentType: "",
        success: false,
        error: String(e),
      });
    }
  }

  /** ファイルが読み取り可能か確認（リトライ付き） */
  private async isFileReady(filePath: string): Promise<boolean> {
    // 最大5回リトライ
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        // ファイルサイズが安定しているか確認
        const stat1 = await Deno.stat(filePath);
        const size1 = stat1.size;

        if (size1 === 0) {
          this.log("info", `📝 ファイルサイズ0... リトライ ${attempt + 1}/5`);
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }

        // 1秒待ってサイズが変わっていないか確認
        await new Promise(r => setTimeout(r, 1000));

        const stat2 = await Deno.stat(filePath);
        const size2 = stat2.size;

        if (size1 !== size2) {
          this.log("info", `📝 書き込み中... リトライ ${attempt + 1}/5`);
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }

        // 読み取りでオープンできるか確認
        const file = await Deno.open(filePath, { read: true });
        file.close();
        return true;
      } catch {
        if (attempt < 4) {
          this.log("info", `⏳ ファイル待機中... リトライ ${attempt + 1}/5`);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }
    return false;
  }

  /** ファイル名を最大長に切り詰め */
  private truncateFilename(name: string): string {
    if (name.length <= this.maxFilenameLength) return name;

    // 区切り文字で自然に切る
    const delimiters = ["　", "、", "（", "(", "・", " ", "-", "_"];
    let cutPos = -1;
    for (const d of delimiters) {
      const pos = name.lastIndexOf(d, this.maxFilenameLength);
      if (pos > cutPos) cutPos = pos;
    }

    if (cutPos >= 10) {
      return name.substring(0, cutPos);
    }
    return name.substring(0, this.maxFilenameLength);
  }

  /** ファイルをリネーム（重複回避付き） */
  private async renameFile(
    originalPath: string,
    newName: string
  ): Promise<RenameResult> {
    try {
      const dir = originalPath.substring(0, originalPath.lastIndexOf(
        originalPath.includes("/") ? "/" : "\\"
      ));
      const sep = originalPath.includes("/") ? "/" : "\\";

      let counter = 1;
      let newPath: string;

      while (true) {
        const suffix = counter === 1 ? "" : `_${counter}`;
        newPath = `${dir}${sep}${newName}${suffix}.pdf`;

        try {
          await Deno.stat(newPath);
          counter++;
        } catch {
          // ファイルが存在しない = 使える
          break;
        }
      }

      await Deno.rename(originalPath, newPath);

      return {
        originalPath,
        newPath,
        documentType: newName,
        success: true,
      };
    } catch (e) {
      return {
        originalPath,
        newPath: "",
        documentType: newName,
        success: false,
        error: String(e),
      };
    }
  }

  /** 監視を停止 */
  stopWatching() {
    for (const [path, watcher] of this.watchers) {
      try {
        watcher.close();
        this.log("info", `監視停止: ${path}`);
      } catch {
        // 既に閉じている場合は無視
      }
    }
    this.watchers.clear();
  }

  /** 監視中か確認 */
  isWatching(): boolean {
    return this.watchers.size > 0;
  }

  /** ログ出力 */
  private log(level: LogEntry["level"], message: string) {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    this.onLog({ timestamp, message, level });
  }
}
