# 紙の名は。v2

PDF自動リネームツール - スキャンしたPDFをAIが自動で適切なファイル名に変更します。

## 特徴

- 📁 **フォルダ監視**: 指定フォルダに新しいPDFが追加されると自動でリネーム
- 🧠 **AI命名**: Claude APIでPDFの内容を解析し、適切なファイル名を生成
- 🌐 **ブラウザUI**: 設定・操作はすべてブラウザから（インストール不要の管理画面）
- 📦 **単一実行ファイル**: Deno compileで単一exeに。配布先は追加インストール不要
- ⚡ **軽量**: 外部ライブラリ依存ゼロ（Deno標準APIのみ使用）

## 必要なもの

- [Claude APIキー](https://console.anthropic.com/settings/keys)

## 使い方（exe版）

1. `kaminonaha.exe` をダブルクリック
2. ブラウザが自動で開く → `http://localhost:52178`
3. 🔑 API設定 → Claude APIキーを入力
4. 📂 フォルダ追加 → 監視するフォルダのパスを入力
5. ▶ 監視開始

## 開発

### 前提

- [Deno](https://deno.land/) v2.0+

### 実行

```bash
deno task dev
```

### Windows用exeにビルド

```bash
deno task compile-windows
```

### 現在の環境用にビルド

```bash
deno task compile
```

## 技術構成

| レイヤー | 技術 |
|---------|------|
| ランタイム | Deno |
| GUI | HTML/CSS/JS（ブラウザベース） |
| サーバー | Deno.serve（ローカルHTTP） |
| リアルタイム更新 | Server-Sent Events (SSE) |
| ファイル監視 | Deno.watchFs |
| PDF解析 | Claude API（PDFを直接送信） |
| 設定保存 | JSON（AppData） |
| 配布形式 | deno compile（単一exe） |

## 設定ファイルの場所

- Windows: `%APPDATA%\KaminonahaV2\config.json`
- macOS: `~/Library/Application Support/KaminonahaV2/config.json`
- Linux: `~/.config/kaminonaha-v2/config.json`

## ライセンス

MIT
