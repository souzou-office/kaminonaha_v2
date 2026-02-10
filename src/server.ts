import { AppConfig, AppState, LogEntry, FolderConfig } from "./types.ts";
import { loadConfig, saveConfig } from "./config.ts";
import { ClaudeClient } from "./claude.ts";
import { FileWatcher } from "./watcher.ts";
import { getWebUI } from "./ui.ts";

/** WebサーバーベースのAPI + UI */
export class Server {
  private config: AppConfig;
  private watcher: FileWatcher;
  private state: AppState;
  private clients: Set<ReadableStreamDefaultController> = new Set(); // SSE clients

  constructor(config: AppConfig) {
    this.config = config;
    this.state = {
      isWatching: false,
      logs: [],
      processedCount: 0,
      errorCount: 0,
    };

    this.watcher = new FileWatcher(
      (entry) => this.addLog(entry),
      (result) => {
        if (result.success) {
          this.state.processedCount++;
        } else {
          this.state.errorCount++;
        }
        this.broadcastState();
      },
      config.maxFilenameLength
    );

    // APIキーが設定済みならクライアントを初期化
    if (config.apiKey) {
      this.watcher.setClient(new ClaudeClient(config.apiKey, config.model));
    }
  }

  /** サーバー起動 */
  async start(): Promise<void> {
    const port = this.config.port || 52178;

    // シングルトンチェック（ポートが使用中なら既存インスタンスを開く）
    try {
      const testConn = await Deno.connect({ hostname: "127.0.0.1", port });
      testConn.close();
      console.log(`既にポート${port}で起動中です。ブラウザで開きます。`);
      this.openBrowser(port);
      Deno.exit(0);
    } catch {
      // ポートが空いている = 新規起動
    }

    Deno.serve({ port, hostname: "127.0.0.1" }, (req) => this.handleRequest(req));

    console.log(`\n  紙の名は。v2 起動中`);
    console.log(`  http://localhost:${port}\n`);

    this.openBrowser(port);

    // 自動開始設定
    if (this.config.autoStart && this.config.apiKey && this.config.watchFolders.length > 0) {
      await this.startWatching();
    }
  }

  /** HTTPリクエストハンドラー */
  private async handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    // CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    try {
      // UI
      if (path === "/" || path === "/index.html") {
        return new Response(getWebUI(), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      // SSE (Server-Sent Events) for real-time updates
      if (path === "/api/events") {
        return this.handleSSE();
      }

      // API Routes
      if (path === "/api/config" && req.method === "GET") {
        // APIキーはマスクして返す
        const safeConfig = {
          ...this.config,
          apiKey: this.config.apiKey ? "****" + this.config.apiKey.slice(-4) : "",
        };
        return Response.json(safeConfig, { headers });
      }

      if (path === "/api/config" && req.method === "PUT") {
        const body = await req.json();
        await this.updateConfig(body);
        return Response.json({ ok: true }, { headers });
      }

      if (path === "/api/apikey" && req.method === "PUT") {
        const { apiKey } = await req.json();
        return Response.json(await this.setApiKey(apiKey), { headers });
      }

      if (path === "/api/apikey/test" && req.method === "POST") {
        const { apiKey } = await req.json();
        const client = new ClaudeClient(apiKey || this.config.apiKey, this.config.model);
        const result = await client.testConnection();
        return Response.json(result, { headers });
      }

      if (path === "/api/watch/start" && req.method === "POST") {
        await this.startWatching();
        return Response.json({ ok: true, isWatching: true }, { headers });
      }

      if (path === "/api/watch/stop" && req.method === "POST") {
        this.stopWatching();
        return Response.json({ ok: true, isWatching: false }, { headers });
      }

      if (path === "/api/state" && req.method === "GET") {
        return Response.json(this.state, { headers });
      }

      if (path === "/api/folders" && req.method === "POST") {
        const folder: FolderConfig = await req.json();
        this.config.watchFolders.push(folder);
        await saveConfig(this.config);
        this.broadcastState();
        return Response.json({ ok: true }, { headers });
      }

      if (path === "/api/folders" && req.method === "DELETE") {
        const { path: folderPath } = await req.json();
        this.config.watchFolders = this.config.watchFolders.filter(
          (f) => f.path !== folderPath
        );
        await saveConfig(this.config);
        this.broadcastState();
        return Response.json({ ok: true }, { headers });
      }

      if (path === "/api/folders" && req.method === "PUT") {
        const folder: FolderConfig = await req.json();
        const idx = this.config.watchFolders.findIndex((f) => f.path === folder.path);
        if (idx >= 0) {
          this.config.watchFolders[idx] = folder;
        }
        await saveConfig(this.config);
        this.broadcastState();
        return Response.json({ ok: true }, { headers });
      }

      if (path === "/api/browse" && req.method === "POST") {
        // フォルダ選択ダイアログの代替: 手動パス入力
        // Denoにはネイティブダイアログがないのでパス検証のみ
        const { path: dirPath } = await req.json();
        try {
          const stat = await Deno.stat(dirPath);
          return Response.json({ valid: stat.isDirectory, path: dirPath }, { headers });
        } catch {
          return Response.json({ valid: false, error: "フォルダが見つかりません" }, { headers });
        }
      }

      return new Response("Not Found", { status: 404, headers });
    } catch (e) {
      console.error("Request error:", e);
      return Response.json({ error: String(e) }, { status: 500, headers });
    }
  }

  /** Server-Sent Events */
  private handleSSE(): Response {
    const stream = new ReadableStream({
      start: (controller) => {
        this.clients.add(controller);

        // 初回接続時に現在の状態を送信
        const data = JSON.stringify({
          state: this.state,
          config: {
            ...this.config,
            apiKey: this.config.apiKey ? "****" + this.config.apiKey.slice(-4) : "",
          },
        });
        controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
      },
      cancel: (controller) => {
        this.clients.delete(controller as ReadableStreamDefaultController);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  /** SSEで全クライアントに状態をブロードキャスト */
  private broadcastState() {
    const data = JSON.stringify({
      state: this.state,
      config: {
        ...this.config,
        apiKey: this.config.apiKey ? "****" + this.config.apiKey.slice(-4) : "",
      },
    });
    const encoded = new TextEncoder().encode(`data: ${data}\n\n`);

    for (const client of this.clients) {
      try {
        client.enqueue(encoded);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  /** ログを追加 */
  private addLog(entry: LogEntry) {
    this.state.logs.push(entry);
    // ログは最新500件のみ保持
    if (this.state.logs.length > 500) {
      this.state.logs = this.state.logs.slice(-500);
    }
    this.broadcastState();
  }

  /** 設定を更新 */
  private async updateConfig(partial: Partial<AppConfig>) {
    // APIキーが "****" で始まる場合は更新しない
    if (partial.apiKey?.startsWith("****")) {
      delete partial.apiKey;
    }
    Object.assign(this.config, partial);
    this.watcher.setMaxFilenameLength(this.config.maxFilenameLength);
    await saveConfig(this.config);
    this.broadcastState();
  }

  /** APIキーを設定 */
  private async setApiKey(apiKey: string): Promise<{ ok: boolean; error?: string }> {
    // テスト
    const client = new ClaudeClient(apiKey, this.config.model);
    const test = await client.testConnection();
    if (!test.ok) {
      return test;
    }

    this.config.apiKey = apiKey;
    this.watcher.setClient(client);
    await saveConfig(this.config);
    this.addLog({ timestamp: "", message: "✅ APIキーを設定しました", level: "success" });
    this.broadcastState();
    return { ok: true };
  }

  /** 監視開始 */
  private async startWatching() {
    if (!this.config.apiKey) {
      this.addLog({ timestamp: "", message: "❌ APIキーが未設定です", level: "error" });
      return;
    }
    if (this.config.watchFolders.length === 0) {
      this.addLog({ timestamp: "", message: "❌ 監視フォルダが未設定です", level: "error" });
      return;
    }

    await this.watcher.startWatching(this.config.watchFolders);
    this.state.isWatching = true;
    this.broadcastState();
  }

  /** 監視停止 */
  private stopWatching() {
    this.watcher.stopWatching();
    this.state.isWatching = false;
    this.broadcastState();
  }

  /** ブラウザを開く */
  private openBrowser(port: number) {
    const url = `http://localhost:${port}`;
    try {
      if (Deno.build.os === "windows") {
        new Deno.Command("cmd", { args: ["/c", "start", url] }).spawn();
      } else if (Deno.build.os === "darwin") {
        new Deno.Command("open", { args: [url] }).spawn();
      } else {
        new Deno.Command("xdg-open", { args: [url] }).spawn();
      }
    } catch {
      console.log(`ブラウザで開いてください: ${url}`);
    }
  }
}
