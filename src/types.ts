/** フォルダ別の監視設定 */
export interface FolderConfig {
  path: string;
  enabled: boolean;
  includeDate: boolean;
  includeNames: boolean;
  customPrompt: string;
}

/** アプリケーション全体の設定 */
export interface AppConfig {
  apiKey: string;
  model: string;
  watchFolders: FolderConfig[];
  maxFilenameLength: number;
  autoStart: boolean;
  port: number;
}

/** ログエントリ */
export interface LogEntry {
  timestamp: string;
  message: string;
  level: "info" | "success" | "error" | "warning";
}

/** リネーム結果 */
export interface RenameResult {
  originalPath: string;
  newPath: string;
  documentType: string;
  success: boolean;
  error?: string;
}

/** アプリの状態 */
export interface AppState {
  isWatching: boolean;
  logs: LogEntry[];
  processedCount: number;
  errorCount: number;
}

/** デフォルト設定 */
export const DEFAULT_CONFIG: AppConfig = {
  apiKey: "",
  model: "claude-sonnet-4-20250514",
  watchFolders: [],
  maxFilenameLength: 40,
  autoStart: false,
  port: 52178,
};
