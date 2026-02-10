import { loadConfig } from "./config.ts";
import { Server } from "./server.ts";

/** 紙の名は。v2 - メインエントリーポイント */
async function main() {
  console.log("");
  console.log("  ╔══════════════════════════════╗");
  console.log("  ║      紙の名は。 v2           ║");
  console.log("  ║  PDF自動リネームツール        ║");
  console.log("  ╚══════════════════════════════╝");
  console.log("");

  // 設定読み込み
  const config = await loadConfig();

  // サーバー起動
  const server = new Server(config);
  await server.start();
}

main().catch((e) => {
  console.error("起動エラー:", e);
  Deno.exit(1);
});
