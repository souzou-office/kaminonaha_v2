import { FolderConfig } from "./types.ts";

/** Claude APIクライアント */
export class ClaudeClient {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "claude-sonnet-4-20250514") {
    this.apiKey = apiKey;
    this.model = model;
  }

  /** APIキーの有効性をテスト */
  async testConnection(): Promise<{ ok: boolean; error?: string }> {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 16,
          messages: [{ role: "user", content: "ping" }],
        }),
      });

      if (response.ok) {
        return { ok: true };
      }
      const err = await response.text();
      return { ok: false, error: `API Error ${response.status}: ${err}` };
    } catch (e) {
      return { ok: false, error: `Connection error: ${e}` };
    }
  }

  /** PDFファイルからドキュメント名を生成 */
  async generateDocumentName(
    pdfPath: string,
    folderConfig: FolderConfig
  ): Promise<string> {
    const pdfData = await Deno.readFile(pdfPath);
    const base64Pdf = btoa(
      String.fromCharCode(...new Uint8Array(pdfData))
    );

    // カスタムプロンプトの構築
    let prompt = this.buildPrompt(folderConfig);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 128,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64Pdf,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Claude API error ${response.status}: ${errText}`);
    }

    const result = await response.json();
    const rawName = result.content?.[0]?.text?.trim() || "名称未設定";
    return this.cleanFilename(rawName, folderConfig);
  }

  /** プロンプトを構築 */
  private buildPrompt(folderConfig: FolderConfig): string {
    const basePrompt = [
      "このPDF文書を分析して、適切なファイル名を1つだけ返してください。",
      "",
      "ルール:",
      "- 文書の種類名やタイトルを短く簡潔に返す（名詞句のみ）",
      "- 句読点、説明文、余計な装飾は不要",
      "- ファイル名に使えない記号 / \\ : * ? \" < > | は使わない",
      "- 日本語の文書なら日本語で返す",
      "- 8〜30文字程度が理想",
      "",
      "例: 見積書 / 契約書 / 登記事項証明書 / 取締役会議事録 / 確定申告書",
    ];

    if (folderConfig.includeNames) {
      basePrompt.push(
        "",
        "追加指示: 文書に記載の会社名または個人名があれば、種類名の後に「_会社名」または「_氏名」の形で付加してください。",
        "例: 見積書_株式会社ABC / 契約書_田中太郎"
      );
    }

    if (folderConfig.customPrompt?.trim()) {
      basePrompt.push("", "ユーザーからの追加指示:", folderConfig.customPrompt);
    }

    return basePrompt.join("\n");
  }

  /** AIの出力をファイル名として整形 */
  private cleanFilename(rawName: string, folderConfig: FolderConfig): string {
    let name = rawName;

    // 1行目のみ取得
    name = name.split("\n")[0].trim();

    // 接頭辞の除去
    name = name.replace(/^(ファイル名|タイトル|題名)[:：]\s*/, "");

    // 「この文書は〜」以降を削除
    name = name.replace(/この文書は.*$/, "");

    // 句点以降を削除
    name = name.split("。")[0].trim();

    // 引用符の除去
    name = name.replace(/[「」"']/g, "");

    // 禁止文字の除去
    name = name.replace(/[<>:"/\\|?*]/g, "");
    name = name.replace(/[\x00-\x1F]/g, "");

    // 連続スペースの縮約
    name = name.replace(/\s{2,}/g, " ").trim();

    // 日付付加
    if (folderConfig.includeDate) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      // 既に8桁日付が含まれていなければ追加
      if (!/(?:19|20)\d{6}/.test(name)) {
        name = `${name}_${dateStr}`;
      }
    }

    // 空なら fallback
    if (!name) name = "名称未設定";

    return name;
  }
}
