/** Web UIのHTML/CSS/JSを返す */
export function getWebUI(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>紙の名は。v2</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=DM+Sans:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #fafaf9;
    --white: #ffffff;
    --text: #1c1917;
    --text2: #78716c;
    --text3: #a8a29e;
    --border: #e7e5e4;
    --border2: #d6d3d1;
    --accent: #c2410c;
    --accent-light: #fff7ed;
    --accent-mid: #fed7aa;
    --green: #15803d;
    --green-light: #f0fdf4;
    --green-mid: #bbf7d0;
    --red: #dc2626;
    --red-light: #fef2f2;
    --yellow: #a16207;
    --yellow-light: #fefce8;
    --radius: 8px;
    --radius-lg: 12px;
    --shadow-sm: 0 1px 2px rgba(28,25,23,0.04);
    --shadow: 0 1px 3px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04);
    --shadow-md: 0 4px 12px rgba(28,25,23,0.08);
    --font-jp: 'Zen Kaku Gothic New', sans-serif;
    --font-en: 'DM Sans', sans-serif;
  }

  body {
    font-family: var(--font-jp);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  header {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand { display: flex; align-items: center; gap: 10px; }

  .brand-mark {
    width: 28px; height: 28px;
    background: var(--accent);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 14px; font-weight: 700;
  }

  .brand-name { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }

  .brand-ver {
    font-family: var(--font-en); font-size: 10px; font-weight: 600;
    color: var(--text3); background: var(--bg);
    padding: 1px 6px; border-radius: 3px; letter-spacing: 0.5px;
  }

  .header-status { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; }
  .header-status.active { color: var(--green); }
  .header-status.inactive { color: var(--text3); }
  .status-indicator { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .header-status.active .status-indicator { animation: blink 2.4s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .container {
    max-width: 960px; margin: 0 auto;
    padding: 28px 24px 60px;
    display: flex; flex-direction: column; gap: 24px;
  }

  .toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .toolbar-spacer { flex: 1; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border: 1px solid var(--border);
    border-radius: var(--radius); font-size: 13px; font-weight: 500;
    font-family: var(--font-jp); cursor: pointer;
    background: var(--white); color: var(--text);
    transition: all 0.12s ease; line-height: 1;
  }
  .btn:hover { border-color: var(--border2); box-shadow: var(--shadow-sm); }
  .btn:active { transform: scale(0.98); }
  .btn-fill { background: var(--text); color: var(--white); border-color: var(--text); }
  .btn-fill:hover { background: #292524; }
  .btn-accent { background: var(--accent); color: white; border-color: var(--accent); }
  .btn-accent:hover { background: #9a3412; }
  .btn-go { background: var(--green); color: white; border-color: var(--green); }
  .btn-go:hover { background: #166534; }
  .btn-stop { background: var(--red); color: white; border-color: var(--red); }
  .btn-stop:hover { background: #b91c1c; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-icon-only { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 14px; }

  .card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
  .card-header { padding: 16px 20px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border); }
  .card-header-icon { font-size: 15px; }
  .card-header-title { font-size: 13px; font-weight: 700; flex: 1; }
  .card-body { padding: 16px 20px; }

  .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .stat { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; text-align: center; box-shadow: var(--shadow-sm); }
  .stat-num { font-family: var(--font-en); font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 1; }
  .stat-num.folders { color: var(--accent); }
  .stat-num.done { color: var(--green); }
  .stat-num.err { color: var(--red); }
  .stat-label { font-size: 11px; color: var(--text3); margin-top: 6px; font-weight: 500; }

  .folder-list { display: flex; flex-direction: column; }
  .folder-row { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--border); transition: background 0.1s; }
  .folder-row:last-child { border-bottom: none; }
  .folder-row:hover { background: var(--bg); }
  .folder-row.off { opacity: 0.45; }
  .folder-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
  .folder-row.off .folder-dot { background: var(--text3); }
  .folder-detail { flex: 1; min-width: 0; }
  .folder-path { font-family: var(--font-en); font-size: 13px; font-weight: 500; word-break: break-all; line-height: 1.4; }
  .folder-meta { display: flex; gap: 6px; margin-top: 4px; flex-wrap: wrap; }
  .pill { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 4px; background: var(--accent-light); color: var(--accent); }
  .pill.off { background: #f5f5f4; color: var(--text3); }
  .folder-actions { display: flex; gap: 2px; flex-shrink: 0; }
  .empty { padding: 40px 20px; text-align: center; color: var(--text3); font-size: 13px; }
  .empty-icon { font-size: 28px; margin-bottom: 8px; opacity: 0.5; }

  .log-box { background: #fafaf9; border-radius: var(--radius); padding: 12px 16px; max-height: 300px; overflow-y: auto; font-size: 12px; line-height: 2; font-family: 'DM Sans','Menlo',monospace; }
  .log-line { display: flex; gap: 8px; }
  .log-t { color: var(--text3); flex-shrink: 0; font-variant-numeric: tabular-nums; }
  .log-m { color: var(--text2); }
  .log-line.ok .log-m { color: var(--green); font-weight: 500; }
  .log-line.ng .log-m { color: var(--red); }
  .log-line.warn .log-m { color: var(--yellow); }

  .overlay { display: none; position: fixed; inset: 0; background: rgba(28,25,23,0.25); backdrop-filter: blur(2px); z-index: 200; align-items: center; justify-content: center; }
  .overlay.open { display: flex; }
  .modal { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 28px; width: 90%; max-width: 480px; max-height: 90vh; overflow-y: auto; animation: modalIn 0.18s ease; }
  @keyframes modalIn { from{opacity:0;transform:translateY(8px) scale(0.98);} to{opacity:1;transform:translateY(0) scale(1);} }
  .modal-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
  .modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); }

  .field { margin-bottom: 16px; }
  .field-label { display: block; font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 5px; }
  .field-input { width: 100%; padding: 9px 12px; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-size: 14px; font-family: var(--font-jp); transition: border-color 0.12s, box-shadow 0.12s; }
  .field-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(194,65,12,0.08); }
  textarea.field-input { resize: vertical; min-height: 72px; line-height: 1.6; }
  .field-hint { font-size: 11px; color: var(--text3); margin-top: 4px; }
  .field-row { display: flex; gap: 8px; align-items: end; }
  .field-row .field { flex: 1; margin-bottom: 0; }

  .switch-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; }
  .switch-row + .switch-row { border-top: 1px solid var(--border); }
  .switch-text { font-size: 13px; }
  .sw { position: relative; width: 38px; height: 22px; cursor: pointer; flex-shrink: 0; }
  .sw input { opacity: 0; width: 0; height: 0; position: absolute; }
  .sw-track { position: absolute; inset: 0; background: var(--border2); border-radius: 11px; transition: 0.2s; }
  .sw-track::after { content: ''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
  .sw input:checked + .sw-track { background: var(--accent); }
  .sw input:checked + .sw-track::after { transform: translateX(16px); }

  .toast-wrap { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 300; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .toast { padding: 10px 20px; border-radius: var(--radius); font-size: 13px; font-weight: 500; box-shadow: var(--shadow-md); animation: toastIn 0.25s ease, toastOut 0.25s ease 2.5s forwards; border: 1px solid; }
  .toast.ok { background: var(--green-light); color: var(--green); border-color: var(--green-mid); }
  .toast.ng { background: var(--red-light); color: var(--red); border-color: #fecaca; }
  @keyframes toastIn { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
  @keyframes toastOut { to{opacity:0;transform:translateY(-8px);} }

  .api-badge { font-family: var(--font-en); font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.3px; }
  .api-badge.on { background: var(--green-light); color: var(--green); }
  .api-badge.off { background: var(--red-light); color: var(--red); }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
</style>
</head>
<body>

<header>
  <div class="header-inner">
    <div class="brand">
      <div class="brand-mark">紙</div>
      <span class="brand-name">紙の名は。</span>
      <span class="brand-ver">V2</span>
    </div>
    <div id="statusBadge" class="header-status inactive">
      <span class="status-indicator"></span>
      <span id="statusText">停止中</span>
    </div>
  </div>
</header>

<div class="container">
  <div class="toolbar">
    <button id="btnStart" class="btn btn-go" onclick="startWatching()">▶ 監視開始</button>
    <button id="btnStop" class="btn btn-stop" onclick="stopWatching()" style="display:none;">■ 停止</button>
    <button class="btn" onclick="openApiModal()">🔑 API設定</button>
    <button class="btn" onclick="openSettingsModal()">⚙ 設定</button>
    <div class="toolbar-spacer"></div>
    <span id="apiBadge" class="api-badge off">API 未設定</span>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-num folders" id="statFolders">0</div><div class="stat-label">監視フォルダ</div></div>
    <div class="stat"><div class="stat-num done" id="statProcessed">0</div><div class="stat-label">処理済み</div></div>
    <div class="stat"><div class="stat-num err" id="statErrors">0</div><div class="stat-label">エラー</div></div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-header-icon">📂</span>
      <span class="card-header-title">監視フォルダ</span>
      <button class="btn btn-accent btn-sm" onclick="openFolderModal()">＋ 追加</button>
    </div>
    <div id="folderList" class="folder-list"><div class="empty"><div class="empty-icon">📁</div>監視フォルダが未登録です</div></div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-header-icon">📋</span>
      <span class="card-header-title">ログ</span>
      <button class="btn btn-sm" onclick="clearLogs()">クリア</button>
    </div>
    <div class="card-body"><div id="logBox" class="log-box"><div class="empty" style="padding:12px;">ログはまだありません</div></div></div>
  </div>
</div>

<div id="toasts" class="toast-wrap"></div>

<div id="apiModal" class="overlay"><div class="modal">
  <div class="modal-title">API設定</div>
  <div class="field"><label class="field-label">Claude APIキー</label><input type="password" id="apiKeyInput" class="field-input" placeholder="sk-ant-..."><div class="field-hint"><a href="https://console.anthropic.com/settings/keys" target="_blank" style="color:var(--accent);">Anthropic Console</a> でキーを取得</div></div>
  <div class="modal-footer"><button class="btn" onclick="closeModal('apiModal')">キャンセル</button><button class="btn" onclick="testApiKey()">テスト</button><button class="btn btn-fill" onclick="saveApiKey()">保存</button></div>
</div></div>

<div id="folderModal" class="overlay"><div class="modal">
  <div class="modal-title">監視フォルダの追加</div>
  <div class="field"><label class="field-label">フォルダ</label><div class="field-row"><input type="text" id="folderPathInput" class="field-input" placeholder="フォルダを選択してください"><button class="btn btn-accent" onclick="browseFolder()" style="white-space:nowrap;">選択</button></div></div>
  <div class="switch-row"><span class="switch-text">📅 日付を付与</span><label class="sw"><input type="checkbox" id="folderIncludeDate"><span class="sw-track"></span></label></div>
  <div class="switch-row"><span class="switch-text">👤 名前を付与</span><label class="sw"><input type="checkbox" id="folderIncludeNames"><span class="sw-track"></span></label></div>
  <div class="field" style="margin-top:12px;"><label class="field-label">AI命名の追加指示（任意）</label><textarea id="folderCustomPrompt" class="field-input" placeholder="例: 種類名を優先。余計な説明は含めない。"></textarea></div>
  <div class="modal-footer"><button class="btn" onclick="closeModal('folderModal')">キャンセル</button><button class="btn btn-fill" onclick="addFolder()">追加</button></div>
</div></div>

<div id="editModal" class="overlay"><div class="modal">
  <div class="modal-title">フォルダ設定</div>
  <input type="hidden" id="editPath">
  <div class="field"><label class="field-label">パス</label><div id="editPathShow" style="font-family:var(--font-en);font-size:13px;color:var(--text2);padding:4px 0;word-break:break-all;"></div></div>
  <div class="switch-row"><span class="switch-text">✅ 監視を有効にする</span><label class="sw"><input type="checkbox" id="editEnabled" checked><span class="sw-track"></span></label></div>
  <div class="switch-row"><span class="switch-text">📅 日付を付与</span><label class="sw"><input type="checkbox" id="editDate"><span class="sw-track"></span></label></div>
  <div class="switch-row"><span class="switch-text">👤 名前を付与</span><label class="sw"><input type="checkbox" id="editNames"><span class="sw-track"></span></label></div>
  <div class="field" style="margin-top:12px;"><label class="field-label">AI命名の追加指示（任意）</label><textarea id="editPrompt" class="field-input" placeholder="例: 種類名を優先"></textarea></div>
  <div class="modal-footer"><button class="btn" onclick="closeModal('editModal')">キャンセル</button><button class="btn btn-fill" onclick="updateFolder()">保存</button></div>
</div></div>

<div id="settingsModal" class="overlay"><div class="modal">
  <div class="modal-title">アプリ設定</div>
  <div class="field"><label class="field-label">最大ファイル名長</label><input type="number" id="setMaxLen" class="field-input" min="20" max="80" value="40"><div class="field-hint">リネーム時のファイル名の最大文字数（20〜80）</div></div>
  <div class="switch-row"><span class="switch-text">🚀 起動時に自動で監視開始</span><label class="sw"><input type="checkbox" id="setAutoStart"><span class="sw-track"></span></label></div>
  <div class="modal-footer"><button class="btn" onclick="closeModal('settingsModal')">キャンセル</button><button class="btn btn-fill" onclick="saveSettings()">保存</button></div>
</div></div>

<script>
let cfg={},st={isWatching:false,logs:[],processedCount:0,errorCount:0};
async function api(p,m='GET',b=null){const o={method:m,headers:{'Content-Type':'application/json'}};if(b)o.body=JSON.stringify(b);return(await fetch('/api'+p,o)).json();}
function sse(){const es=new EventSource('/api/events');es.onmessage=e=>{try{const d=JSON.parse(e.data);if(d.state)st=d.state;if(d.config)cfg=d.config;render();}catch{}};es.onerror=()=>setTimeout(sse,3000);}
function render(){
  const w=st.isWatching;
  document.getElementById('statusBadge').className='header-status '+(w?'active':'inactive');
  document.getElementById('statusText').textContent=w?'監視中':'停止中';
  document.getElementById('btnStart').style.display=w?'none':'';
  document.getElementById('btnStop').style.display=w?'':'none';
  const fs=cfg.watchFolders||[];
  document.getElementById('statFolders').textContent=fs.filter(f=>f.enabled).length;
  document.getElementById('statProcessed').textContent=st.processedCount;
  document.getElementById('statErrors').textContent=st.errorCount;
  const ab=document.getElementById('apiBadge');
  if(cfg.apiKey){ab.textContent='API '+cfg.apiKey;ab.className='api-badge on';}else{ab.textContent='API 未設定';ab.className='api-badge off';}
  rFolders(fs);rLogs(st.logs||[]);
}
function rFolders(fs){
  const el=document.getElementById('folderList');
  if(!fs.length){el.innerHTML='<div class="empty"><div class="empty-icon">📁</div>監視フォルダが未登録です</div>';return;}
  el.innerHTML=fs.map(f=>{
    const p=[];if(f.includeDate)p.push('<span class="pill">日付</span>');if(f.includeNames)p.push('<span class="pill">名前</span>');if(f.customPrompt)p.push('<span class="pill">カスタム</span>');if(!f.enabled)p.push('<span class="pill off">無効</span>');
    return '<div class="folder-row '+(f.enabled?'':'off')+'"><div class="folder-dot"></div><div class="folder-detail"><div class="folder-path">'+esc(f.path)+'</div>'+(p.length?'<div class="folder-meta">'+p.join('')+'</div>':'')+'</div><div class="folder-actions"><button class="btn btn-icon-only" onclick="editFolder(\''+attr(f.path)+'\')" title="編集">✏️</button><button class="btn btn-icon-only" onclick="deleteFolder(\''+attr(f.path)+'\')" title="削除" style="color:var(--red);">✕</button></div></div>';
  }).join('');
}
function rLogs(logs){
  const el=document.getElementById('logBox');
  if(!logs.length){el.innerHTML='<div class="empty" style="padding:12px;">ログはまだありません</div>';return;}
  el.innerHTML=logs.slice(-200).map(l=>{const c=l.level==='success'?'ok':l.level==='error'?'ng':l.level==='warning'?'warn':'';return '<div class="log-line '+c+'"><span class="log-t">'+l.timestamp+'</span><span class="log-m">'+esc(l.message)+'</span></div>';}).join('');
  el.scrollTop=el.scrollHeight;
}
async function startWatching(){await api('/watch/start','POST');}
async function stopWatching(){await api('/watch/stop','POST');}
function clearLogs(){st.logs=[];rLogs([]);}
function openApiModal(){document.getElementById('apiModal').classList.add('open');document.getElementById('apiKeyInput').value='';document.getElementById('apiKeyInput').focus();}
async function testApiKey(){const k=document.getElementById('apiKeyInput').value.trim();if(!k)return toast('APIキーを入力してください','ng');const r=await api('/apikey/test','POST',{apiKey:k});toast(r.ok?'接続テスト成功':'接続失敗: '+(r.error||''),r.ok?'ok':'ng');}
async function saveApiKey(){const k=document.getElementById('apiKeyInput').value.trim();if(!k)return toast('APIキーを入力してください','ng');const r=await api('/apikey','PUT',{apiKey:k});if(r.ok){toast('APIキーを保存しました','ok');closeModal('apiModal');}else toast('保存失敗: '+(r.error||''),'ng');}
function openFolderModal(){document.getElementById('folderModal').classList.add('open');document.getElementById('folderPathInput').value='';document.getElementById('folderIncludeDate').checked=false;document.getElementById('folderIncludeNames').checked=false;document.getElementById('folderCustomPrompt').value='';}
async function browseFolder(){const btn=event.target;btn.disabled=true;btn.textContent='選択中…';try{const r=await api('/browse','POST');if(r.valid&&r.path){document.getElementById('folderPathInput').value=r.path;toast('フォルダを選択しました','ok');}else if(r.error&&r.error!=='キャンセルされました')toast(r.error,'ng');}catch{toast('フォルダ選択に失敗','ng');}finally{btn.disabled=false;btn.textContent='選択';}}
async function addFolder(){const p=document.getElementById('folderPathInput').value.trim();if(!p)return toast('フォルダを選択してください','ng');const chk=await api('/browse/validate','POST',{path:p});if(!chk.valid)return toast('フォルダが見つかりません','ng');if((cfg.watchFolders||[]).some(f=>f.path===p))return toast('既に追加されています','ng');await api('/folders','POST',{path:p,enabled:true,includeDate:document.getElementById('folderIncludeDate').checked,includeNames:document.getElementById('folderIncludeNames').checked,customPrompt:document.getElementById('folderCustomPrompt').value.trim()});toast('追加しました','ok');closeModal('folderModal');}
function editFolder(p){const f=(cfg.watchFolders||[]).find(x=>x.path===p);if(!f)return;document.getElementById('editPath').value=f.path;document.getElementById('editPathShow').textContent=f.path;document.getElementById('editEnabled').checked=f.enabled;document.getElementById('editDate').checked=f.includeDate;document.getElementById('editNames').checked=f.includeNames;document.getElementById('editPrompt').value=f.customPrompt||'';document.getElementById('editModal').classList.add('open');}
async function updateFolder(){await api('/folders','PUT',{path:document.getElementById('editPath').value,enabled:document.getElementById('editEnabled').checked,includeDate:document.getElementById('editDate').checked,includeNames:document.getElementById('editNames').checked,customPrompt:document.getElementById('editPrompt').value.trim()});toast('更新しました','ok');closeModal('editModal');}
async function deleteFolder(p){if(!confirm('このフォルダを削除しますか？'))return;await api('/folders','DELETE',{path:p});toast('削除しました','ok');}
function openSettingsModal(){document.getElementById('setMaxLen').value=cfg.maxFilenameLength||40;document.getElementById('setAutoStart').checked=cfg.autoStart||false;document.getElementById('settingsModal').classList.add('open');}
async function saveSettings(){await api('/config','PUT',{maxFilenameLength:parseInt(document.getElementById('setMaxLen').value)||40,autoStart:document.getElementById('setAutoStart').checked});toast('保存しました','ok');closeModal('settingsModal');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.overlay.open').forEach(m=>m.classList.remove('open'));});
function toast(msg,type='ok'){const c=document.getElementById('toasts'),el=document.createElement('div');el.className='toast '+type;el.textContent=msg;c.appendChild(el);setTimeout(()=>el.remove(),3000);}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function attr(s){return s.replace(/\\\\/g,'\\\\\\\\').replace(/'/g,"\\\\'");}
sse();
</script>
</body>
</html>`;
}
