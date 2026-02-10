import { AppConfig, DEFAULT_CONFIG } from "./types.ts";

/** 設定ファイルのパスを取得 */
function getConfigDir(): string {
  const os = Deno.build.os;
  if (os === "windows") {
    const appData = Deno.env.get("APPDATA") || Deno.env.get("LOCALAPPDATA") || "";
    return `${appData}\\KaminonahaV2`;
  } else if (os === "darwin") {
    const home = Deno.env.get("HOME") || "";
    return `${home}/Library/Application Support/KaminonahaV2`;
  } else {
    const home = Deno.env.get("HOME") || "";
    return `${home}/.config/kaminonaha-v2`;
  }
}

function getConfigPath(): string {
  return `${getConfigDir()}/config.json`;
}

/** 設定ファイルを読み込み */
export async function loadConfig(): Promise<AppConfig> {
  try {
    const path = getConfigPath();
    const data = await Deno.readTextFile(path);
    const parsed = JSON.parse(data);
    // デフォルト値とマージ
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/** 設定ファイルを保存 */
export async function saveConfig(config: AppConfig): Promise<void> {
  const dir = getConfigDir();
  await Deno.mkdir(dir, { recursive: true });
  const path = getConfigPath();
  // APIキーは設定ファイルに保存（暗号化は将来対応）
  await Deno.writeTextFile(path, JSON.stringify(config, null, 2));
}

/** 設定ファイルが存在するか確認 */
export async function configExists(): Promise<boolean> {
  try {
    await Deno.stat(getConfigPath());
    return true;
  } catch {
    return false;
  }
}
