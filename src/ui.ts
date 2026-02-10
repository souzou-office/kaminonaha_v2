/** Web UIのHTML/CSS/JSを返す */
export function getWebUI(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>紙の名は。v2</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0f1117;
    --surface: #1a1d27;
    --surface2: #232733;
    --border: #2e3347;
    --text: #e4e7ef;
    --text2: #8b90a5;
    --accent: #6c8aff;
    --accent-dim: rgba(108,138,255,0.12);
    --green: #4ade80;
    --green-dim: rgba(74,222,128,0.12);
    --red: #f87171;
    --red-dim: rgba(248,113,113,0.12);
    --yellow: #fbbf24;
    --yellow-dim: rgba(251,191,36,0.12);
    --radius: 10px;
    --shadow: 0 2px 12px rgba(0,0,0,0.3);
  }

  body {
    font-family: 'Noto Sans JP', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.6;
  }

  /* Header */
  .header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .logo {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .logo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--accent), #a78bfa);
    border-radius: 8px;
    font-size: 18px;
  }

  .version {
    font-size: 11px;
    color: var(--text2);
    background: var(--surface2);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }

  .status-badge.watching {
    background: var(--green-dim);
    color: var(--green);
  }

  .status-badge.stopped {
    background: var(--surface2);
    color: var(--text2);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

  .status-badge.watching .status-dot {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* Layout */
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Cards */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
  }

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Controls Row */
  .controls-row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .btn:hover { transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }

  .btn-primary {
    background: var(--accent);
    color: white;
  }
  .btn-primary:hover { background: #5a7aff; }

  .btn-success {
    background: var(--green);
    color: #0a2010;
  }
  .btn-success:hover { background: #3ecf6e; }

  .btn-danger {
    background: var(--red);
    color: white;
  }
  .btn-danger:hover { background: #e65a5a; }

  .btn-ghost {
    background: transparent;
    color: var(--text2);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover {
    background: var(--surface2);
    color: var(--text);
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 13px;
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  /* Stats */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .stat-item {
    background: var(--surface2);
    border-radius: 8px;
    padding: 16px;
    text-align: center;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text2);
    margin-top: 4px;
  }

  /* Folder list */
  .folder-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .folder-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--surface2);
    border-radius: 8px;
    border: 1px solid transparent;
    transition: border-color 0.15s;
  }

  .folder-item:hover {
    border-color: var(--border);
  }

  .folder-item.disabled {
    opacity: 0.5;
  }

  .folder-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .folder-info {
    flex: 1;
    min-width: 0;
  }

  .folder-path {
    font-size: 13px;
    font-family: monospace;
    color: var(--text);
    word-break: break-all;
  }

  .folder-tags {
    display: flex;
    gap: 6px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 4px;
    background: var(--accent-dim);
    color: var(--accent);
  }

  .folder-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .btn-icon {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--text2);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.15s;
  }

  .btn-icon:hover {
    background: var(--surface);
    color: var(--text);
  }

  .btn-icon.delete:hover {
    background: var(--red-dim);
    color: var(--red);
  }

  .empty-state {
    text-align: center;
    padding: 32px;
    color: var(--text2);
    font-size: 14px;
  }

  /* Log */
  .log-container {
    background: #0d0f14;
    border-radius: 8px;
    padding: 16px;
    max-height: 320px;
    overflow-y: auto;
    font-family: 'Courier New', monospace;
    font-size: 12.5px;
    line-height: 1.8;
  }

  .log-entry {
    display: flex;
    gap: 10px;
    padding: 1px 0;
  }

  .log-time {
    color: var(--text2);
    flex-shrink: 0;
  }

  .log-msg { color: var(--text); }
  .log-entry.success .log-msg { color: var(--green); }
  .log-entry.error .log-msg { color: var(--red); }
  .log-entry.warning .log-msg { color: var(--yellow); }

  /* Inputs */
  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text2);
    margin-bottom: 6px;
  }

  .form-input {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.15s;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  textarea.form-input {
    resize: vertical;
    min-height: 80px;
  }

  .form-hint {
    font-size: 12px;
    color: var(--text2);
    margin-top: 4px;
  }

  .form-row {
    display: flex;
    gap: 12px;
    align-items: end;
  }

  .form-row .form-group {
    flex: 1;
  }

  /* Toggle switch */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .toggle-label {
    font-size: 14px;
    color: var(--text);
  }

  .toggle {
    position: relative;
    width: 44px;
    height: 24px;
    cursor: pointer;
  }

  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    inset: 0;
    background: var(--surface2);
    border-radius: 12px;
    border: 1px solid var(--border);
    transition: 0.2s;
  }

  .toggle-slider::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    left: 2px;
    top: 2px;
    background: var(--text2);
    border-radius: 50%;
    transition: 0.2s;
  }

  .toggle input:checked + .toggle-slider {
    background: var(--accent);
    border-color: var(--accent);
  }

  .toggle input:checked + .toggle-slider::before {
    transform: translateX(20px);
    background: white;
  }

  /* Modal */
  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 200;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }

  .modal-overlay.active {
    display: flex;
  }

  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 32px;
    width: 90%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 48px rgba(0,0,0,0.4);
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .modal-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 24px;
  }

  /* Notification toast */
  .toast-container {
    position: fixed;
    top: 80px;
    right: 24px;
    z-index: 300;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toast {
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 13px;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    box-shadow: var(--shadow);
  }

  .toast.success { background: var(--green-dim); color: var(--green); border: 1px solid rgba(74,222,128,0.2); }
  .toast.error { background: var(--red-dim); color: var(--red); border: 1px solid rgba(248,113,113,0.2); }

  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes fadeOut { to { opacity: 0; transform: translateY(-10px); } }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text2); }
</style>
</head>
<body>

<!-- Header -->
<div class="header">
  <div class="header-left">
    <span class="logo-icon">📄</span>
    <span class="logo">紙の名は。</span>
    <span class="version">v2</span>
  </div>
  <div id="statusBadge" class="status-badge stopped">
    <span class="status-dot"></span>
    <span id="statusText">停止中</span>
  </div>
</div>

<!-- Content -->
<div class="container">

  <!-- Controls -->
  <div class="card">
    <div class="controls-row">
      <button id="btnStart" class="btn btn-success" onclick="startWatching()">
        ▶ 監視開始
      </button>
      <button id="btnStop" class="btn btn-danger" onclick="stopWatching()" style="display:none;">
        ■ 監視停止
      </button>
      <button class="btn btn-ghost" onclick="openApiModal()">
        🔑 API設定
      </button>
      <button class="btn btn-ghost" onclick="openSettingsModal()">
        ⚙ 設定
      </button>
      <div style="flex:1;"></div>
      <div id="apiStatus" class="tag" style="font-size:12px;"></div>
    </div>
  </div>

  <!-- Stats -->
  <div class="stats-row">
    <div class="stat-item">
      <div class="stat-value" style="color:var(--accent);" id="statFolders">0</div>
      <div class="stat-label">監視フォルダ数</div>
    </div>
    <div class="stat-item">
      <div class="stat-value" style="color:var(--green);" id="statProcessed">0</div>
      <div class="stat-label">処理済み</div>
    </div>
    <div class="stat-item">
      <div class="stat-value" style="color:var(--red);" id="statErrors">0</div>
      <div class="stat-label">エラー</div>
    </div>
  </div>

  <!-- Folders -->
  <div class="card">
    <div class="card-title">
      📂 監視フォルダ
      <div style="flex:1;"></div>
      <button class="btn btn-primary btn-sm" onclick="openFolderModal()">+ 追加</button>
    </div>
    <div id="folderList" class="folder-list">
      <div class="empty-state">監視フォルダが設定されていません</div>
    </div>
  </div>

  <!-- Log -->
  <div class="card">
    <div class="card-title">
      📋 ログ
      <div style="flex:1;"></div>
      <button class="btn btn-ghost btn-sm" onclick="clearLogs()">クリア</button>
    </div>
    <div id="logContainer" class="log-container">
      <div class="empty-state" style="padding:16px;">ログはまだありません</div>
    </div>
  </div>
</div>

<!-- Toast container -->
<div id="toastContainer" class="toast-container"></div>

<!-- API Key Modal -->
<div id="apiModal" class="modal-overlay">
  <div class="modal">
    <div class="modal-title">🔑 Claude APIキー設定</div>
    <div class="form-group">
      <label class="form-label">APIキー</label>
      <input type="password" id="apiKeyInput" class="form-input" placeholder="sk-ant-...">
      <div class="form-hint">
        <a href="https://console.anthropic.com/settings/keys" target="_blank" style="color:var(--accent);">
          Anthropic Consoleでキーを取得 →
        </a>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal('apiModal')">キャンセル</button>
      <button class="btn btn-ghost" onclick="testApiKey()">テスト</button>
      <button class="btn btn-primary" onclick="saveApiKey()">保存</button>
    </div>
  </div>
</div>

<!-- Add Folder Modal -->
<div id="folderModal" class="modal-overlay">
  <div class="modal">
    <div class="modal-title">📂 監視フォルダの追加</div>
    <div class="form-group">
      <label class="form-label">フォルダパス</label>
      <div class="form-row">
        <input type="text" id="folderPathInput" class="form-input"
          placeholder="パスを入力 または 右のボタンで選択">
        <button class="btn btn-primary" onclick="browseFolder()" style="white-space:nowrap;">📂 選択</button>
      </div>
      <div class="form-hint">「選択」ボタンでフォルダ選択ダイアログが開きます</div>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">📅 ファイル名に日付を付ける</span>
      <label class="toggle">
        <input type="checkbox" id="folderIncludeDate">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">👤 ファイル名に名前を付ける</span>
      <label class="toggle">
        <input type="checkbox" id="folderIncludeNames">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="form-group" style="margin-top:12px;">
      <label class="form-label">AI命名の追加指示（任意）</label>
      <textarea id="folderCustomPrompt" class="form-input"
        placeholder="例: 種類名を優先（見積書/契約書など）。余計な説明や会社名は含めない。"></textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal('folderModal')">キャンセル</button>
      <button class="btn btn-primary" onclick="addFolder()">追加</button>
    </div>
  </div>
</div>

<!-- Edit Folder Modal -->
<div id="editFolderModal" class="modal-overlay">
  <div class="modal">
    <div class="modal-title">📂 フォルダ設定の編集</div>
    <input type="hidden" id="editFolderPath">
    <div class="form-group">
      <label class="form-label">フォルダパス</label>
      <div id="editFolderPathDisplay" style="font-family:monospace;font-size:13px;color:var(--text2);padding:8px 0;"></div>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">✅ 監視を有効にする</span>
      <label class="toggle">
        <input type="checkbox" id="editFolderEnabled" checked>
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">📅 ファイル名に日付を付ける</span>
      <label class="toggle">
        <input type="checkbox" id="editFolderIncludeDate">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">👤 ファイル名に名前を付ける</span>
      <label class="toggle">
        <input type="checkbox" id="editFolderIncludeNames">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="form-group" style="margin-top:12px;">
      <label class="form-label">AI命名の追加指示（任意）</label>
      <textarea id="editFolderCustomPrompt" class="form-input"
        placeholder="例: 種類名を優先（見積書/契約書など）"></textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal('editFolderModal')">キャンセル</button>
      <button class="btn btn-primary" onclick="updateFolder()">保存</button>
    </div>
  </div>
</div>

<!-- Settings Modal -->
<div id="settingsModal" class="modal-overlay">
  <div class="modal">
    <div class="modal-title">⚙ アプリ設定</div>
    <div class="form-group">
      <label class="form-label">最大ファイル名長</label>
      <input type="number" id="settingsMaxLen" class="form-input" min="20" max="80" value="40">
      <div class="form-hint">リネーム時のファイル名の最大文字数（20〜80）</div>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">🚀 起動時に自動で監視開始</span>
      <label class="toggle">
        <input type="checkbox" id="settingsAutoStart">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal('settingsModal')">キャンセル</button>
      <button class="btn btn-primary" onclick="saveSettings()">保存</button>
    </div>
  </div>
</div>

<script>
  // --- State ---
  let currentConfig = {};
  let currentState = { isWatching: false, logs: [], processedCount: 0, errorCount: 0 };

  // --- API helpers ---
  async function api(path, method = 'GET', body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch('/api' + path, opts);
    return res.json();
  }

  // --- SSE Connection ---
  function connectSSE() {
    const es = new EventSource('/api/events');
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.state) {
          currentState = data.state;
          updateUI();
        }
        if (data.config) {
          currentConfig = data.config;
          updateUI();
        }
      } catch {}
    };
    es.onerror = () => {
      setTimeout(connectSSE, 3000);
    };
  }

  // --- UI Update ---
  function updateUI() {
    // Status badge
    const badge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    const btnStart = document.getElementById('btnStart');
    const btnStop = document.getElementById('btnStop');

    if (currentState.isWatching) {
      badge.className = 'status-badge watching';
      statusText.textContent = '監視中';
      btnStart.style.display = 'none';
      btnStop.style.display = '';
    } else {
      badge.className = 'status-badge stopped';
      statusText.textContent = '停止中';
      btnStart.style.display = '';
      btnStop.style.display = 'none';
    }

    // Stats
    const folders = currentConfig.watchFolders || [];
    document.getElementById('statFolders').textContent = folders.filter(f => f.enabled).length;
    document.getElementById('statProcessed').textContent = currentState.processedCount;
    document.getElementById('statErrors').textContent = currentState.errorCount;

    // API status
    const apiStatus = document.getElementById('apiStatus');
    if (currentConfig.apiKey) {
      apiStatus.textContent = 'API: ' + currentConfig.apiKey;
      apiStatus.style.background = 'var(--green-dim)';
      apiStatus.style.color = 'var(--green)';
    } else {
      apiStatus.textContent = 'API: 未設定';
      apiStatus.style.background = 'var(--red-dim)';
      apiStatus.style.color = 'var(--red)';
    }

    // Folder list
    renderFolders(folders);

    // Logs
    renderLogs(currentState.logs || []);
  }

  function renderFolders(folders) {
    const container = document.getElementById('folderList');
    if (!folders.length) {
      container.innerHTML = '<div class="empty-state">監視フォルダが設定されていません</div>';
      return;
    }

    container.innerHTML = folders.map(f => {
      const tags = [];
      if (f.includeDate) tags.push('<span class="tag">📅 日付</span>');
      if (f.includeNames) tags.push('<span class="tag">👤 名前</span>');
      if (f.customPrompt) tags.push('<span class="tag">🧠 カスタム</span>');
      if (!f.enabled) tags.push('<span class="tag" style="background:var(--red-dim);color:var(--red);">無効</span>');

      return \`
        <div class="folder-item \${f.enabled ? '' : 'disabled'}">
          <span class="folder-icon">📁</span>
          <div class="folder-info">
            <div class="folder-path">\${escapeHtml(f.path)}</div>
            <div class="folder-tags">\${tags.join('')}</div>
          </div>
          <div class="folder-actions">
            <button class="btn-icon" onclick="editFolder('\${escapeAttr(f.path)}')" title="編集">✏️</button>
            <button class="btn-icon delete" onclick="deleteFolder('\${escapeAttr(f.path)}')" title="削除">🗑️</button>
          </div>
        </div>
      \`;
    }).join('');
  }

  function renderLogs(logs) {
    const container = document.getElementById('logContainer');
    if (!logs.length) {
      container.innerHTML = '<div class="empty-state" style="padding:16px;">ログはまだありません</div>';
      return;
    }

    const html = logs.slice(-200).map(l => \`
      <div class="log-entry \${l.level}">
        <span class="log-time">\${l.timestamp}</span>
        <span class="log-msg">\${escapeHtml(l.message)}</span>
      </div>
    \`).join('');

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  }

  // --- Actions ---
  async function startWatching() {
    await api('/watch/start', 'POST');
  }

  async function stopWatching() {
    await api('/watch/stop', 'POST');
  }

  function clearLogs() {
    currentState.logs = [];
    renderLogs([]);
  }

  // --- API Key ---
  function openApiModal() {
    document.getElementById('apiModal').classList.add('active');
    document.getElementById('apiKeyInput').value = '';
    document.getElementById('apiKeyInput').focus();
  }

  async function testApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) return toast('APIキーを入力してください', 'error');

    const result = await api('/apikey/test', 'POST', { apiKey: key });
    if (result.ok) {
      toast('接続テスト成功！', 'success');
    } else {
      toast('接続失敗: ' + (result.error || ''), 'error');
    }
  }

  async function saveApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) return toast('APIキーを入力してください', 'error');

    const result = await api('/apikey', 'PUT', { apiKey: key });
    if (result.ok) {
      toast('APIキーを保存しました', 'success');
      closeModal('apiModal');
    } else {
      toast('保存失敗: ' + (result.error || ''), 'error');
    }
  }

  // --- Folders ---
  function openFolderModal() {
    document.getElementById('folderModal').classList.add('active');
    document.getElementById('folderPathInput').value = '';
    document.getElementById('folderIncludeDate').checked = false;
    document.getElementById('folderIncludeNames').checked = false;
    document.getElementById('folderCustomPrompt').value = '';
    document.getElementById('folderPathInput').focus();
  }

  async function browseFolder() {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '選択中...';
    try {
      const result = await api('/browse', 'POST');
      if (result.valid && result.path) {
        document.getElementById('folderPathInput').value = result.path;
        toast('フォルダを選択しました', 'success');
      } else if (result.error && result.error !== 'キャンセルされました') {
        toast(result.error, 'error');
      }
    } catch (e) {
      toast('フォルダ選択に失敗しました', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '📂 選択';
    }
  }

  async function addFolder() {
    const path = document.getElementById('folderPathInput').value.trim();
    if (!path) return toast('フォルダパスを入力または選択してください', 'error');

    // パスの検証
    const check = await api('/browse/validate', 'POST', { path });
    if (!check.valid) {
      return toast('フォルダが見つかりません: ' + path, 'error');
    }

    // 重複チェック
    if ((currentConfig.watchFolders || []).some(f => f.path === path)) {
      return toast('このフォルダは既に追加されています', 'error');
    }

    await api('/folders', 'POST', {
      path,
      enabled: true,
      includeDate: document.getElementById('folderIncludeDate').checked,
      includeNames: document.getElementById('folderIncludeNames').checked,
      customPrompt: document.getElementById('folderCustomPrompt').value.trim(),
    });

    toast('フォルダを追加しました', 'success');
    closeModal('folderModal');
  }

  function editFolder(path) {
    const folder = (currentConfig.watchFolders || []).find(f => f.path === path);
    if (!folder) return;

    document.getElementById('editFolderPath').value = folder.path;
    document.getElementById('editFolderPathDisplay').textContent = folder.path;
    document.getElementById('editFolderEnabled').checked = folder.enabled;
    document.getElementById('editFolderIncludeDate').checked = folder.includeDate;
    document.getElementById('editFolderIncludeNames').checked = folder.includeNames;
    document.getElementById('editFolderCustomPrompt').value = folder.customPrompt || '';
    document.getElementById('editFolderModal').classList.add('active');
  }

  async function updateFolder() {
    const path = document.getElementById('editFolderPath').value;
    await api('/folders', 'PUT', {
      path,
      enabled: document.getElementById('editFolderEnabled').checked,
      includeDate: document.getElementById('editFolderIncludeDate').checked,
      includeNames: document.getElementById('editFolderIncludeNames').checked,
      customPrompt: document.getElementById('editFolderCustomPrompt').value.trim(),
    });
    toast('設定を更新しました', 'success');
    closeModal('editFolderModal');
  }

  async function deleteFolder(path) {
    if (!confirm('このフォルダを監視対象から削除しますか？')) return;
    await api('/folders', 'DELETE', { path });
    toast('フォルダを削除しました', 'success');
  }

  // --- Settings ---
  function openSettingsModal() {
    document.getElementById('settingsMaxLen').value = currentConfig.maxFilenameLength || 40;
    document.getElementById('settingsAutoStart').checked = currentConfig.autoStart || false;
    document.getElementById('settingsModal').classList.add('active');
  }

  async function saveSettings() {
    await api('/config', 'PUT', {
      maxFilenameLength: parseInt(document.getElementById('settingsMaxLen').value) || 40,
      autoStart: document.getElementById('settingsAutoStart').checked,
    });
    toast('設定を保存しました', 'success');
    closeModal('settingsModal');
  }

  // --- Modal helpers ---
  function closeModal(id) {
    document.getElementById(id).classList.remove('active');
  }

  // Click outside to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  // ESC to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  // --- Toast ---
  function toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  // --- Util ---
  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function escapeAttr(s) {
    return s.replace(/\\\\/g,'\\\\\\\\').replace(/'/g,"\\\\'");
  }

  // --- Init ---
  connectSSE();
</script>
</body>
</html>`;
}
