const API = '/api/cms';
const DEV_TOKEN = location.hostname === '127.0.0.1' || location.hostname === 'localhost' ? 'local-dev-secret' : '';
const PAGE_LABELS = { home:'홈', company:'회사소개', fields:'가공분야', products:'제품·가공사례', facilities:'설비현황', quality:'품질관리' };
const SCREEN_PATH = (page) => typeof window.DGTC_SCREEN_PATH === 'function' ? window.DGTC_SCREEN_PATH(page) : `${window.DGTC_SCREEN_BASE || '/public/screens'}/${page}.jpg`;

const state = {
  view: 'dashboard',
  dashboard: null,
  slots: [],
  notices: [],
  page: 'home',
  selectedSlotId: null,
  selectedNoticeId: null,
  sourceFile: null,
  sourceBitmap: null,
  candidates: new Map(),
  selectedPreset: 'natural',
  focalX: .5,
  focalY: .5,
  processing: false,
  noticeCoverFile: null,
};

const app = document.querySelector('#admin-app');

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function attr(value) { return esc(value).replace(/`/g, '&#96;'); }

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('ko-KR', { dateStyle:'medium', timeStyle:'short' }).format(date);
}

function statusLabel(status) {
  return ({ draft:'임시저장', scheduled:'예약', published:'게시 중', hidden:'숨김', deleted:'휴지통', archived:'이전 버전' })[status] || status || '-';
}

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (DEV_TOKEN) headers.set('x-dgtc-dev-admin', DEV_TOKEN);
  if (options.body && !(options.body instanceof FormData) && !headers.has('content-type')) headers.set('content-type', 'application/json');
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({ ok:false, error:'INVALID_RESPONSE' }));
  if (!response.ok || !data.ok) {
    const err = new Error(data.message || errorMessage(data.error) || `요청 실패 (${response.status})`);
    err.code = data.error;
    err.status = response.status;
    throw err;
  }
  return data;
}

function errorMessage(code) {
  return ({
    ADMIN_AUTH_REQUIRED:'관리자 인증이 필요합니다.',
    ADMIN_AUTH_INVALID:'관리자 권한을 확인할 수 없습니다.',
    SLOT_NOT_FOUND:'이미지 위치를 찾을 수 없습니다.',
    IMAGE_TOO_LARGE:'이미지 용량이 너무 큽니다.',
    UNSUPPORTED_IMAGE:'JPEG, PNG, WebP 이미지만 사용할 수 있습니다.',
    IMAGE_DIMENSIONS_INVALID:'이미지 해상도가 올바르지 않습니다.',
    IMAGE_WIDTH_TOO_SMALL:'원본 이미지의 가로 해상도가 부족합니다.',
    NO_ROLLBACK_VERSION:'되돌릴 이전 이미지가 없습니다.',
    NOTICE_NOT_FOUND:'공지사항을 찾을 수 없습니다.',
    ACTIVE_VERSION_CANNOT_DELETE:'현재 게시 중인 이미지는 삭제할 수 없습니다.',
  })[code];
}

function toast(message, type = 'ok') {
  let region = document.querySelector('.toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    document.body.append(region);
  }
  const node = document.createElement('div');
  node.className = `toast ${type === 'error' ? 'error' : ''}`;
  node.textContent = message;
  region.append(node);
  setTimeout(() => node.remove(), 3200);
}

function shell(content, title) {
  const nav = [
    ['dashboard','⌂','첫 화면'],
    ['images','▣','사진 바꾸기'],
    ['notices','✎','공지사항'],
  ];
  return `
  <div class="admin-app">
    <div class="shell">
      <aside class="side">
        <div class="brand"><div class="brand-mark">D</div><div><strong>대광테크</strong><small>홈페이지 관리</small></div></div>
        <nav class="nav" aria-label="관리 메뉴">
          ${nav.map(([id,icon,label]) => `<button type="button" data-view="${id}" class="${state.view===id?'active':''}"><span>${icon}</span>${label}</button>`).join('')}
        </nav>
        <div class="side-foot">사진과 공지사항만 안전하게 관리합니다.<br>업로드만으로 공개되지 않으며, 게시 버튼을 눌러야 반영됩니다.</div>
      </aside>
      <main class="main">
        <header class="topbar"><h1>${esc(title)}</h1><div class="topbar-actions"><span class="status-dot" aria-hidden="true"></span><span>관리 시스템 정상</span></div></header>
        <div class="content">${content}</div>
      </main>
    </div>
    <nav class="mobile-nav" aria-label="모바일 관리 메뉴">
      ${nav.map(([id,icon,label]) => `<button type="button" data-view="${id}" class="${state.view===id?'active':''}"><span>${icon}</span>${label}</button>`).join('')}
    </nav>
  </div>`;
}

function bindShell() {
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.view)));
}

async function navigate(view) {
  state.view = view;
  history.replaceState(null, '', `#${view}`);
  await render();
}

async function loadDashboard(force=false) {
  if (!state.dashboard || force) state.dashboard = (await api('/admin/dashboard')).counts;
}
async function loadSlots(force=false) {
  if (!state.slots.length || force) state.slots = (await api('/admin/slots')).slots;
}
async function loadNotices(force=false) {
  if (!state.notices.length || force) state.notices = (await api('/admin/notices')).notices;
}

async function render() {
  try {
    if (state.view === 'dashboard') return await renderDashboard();
    if (state.view === 'images') return await renderImages();
    if (state.view === 'notices') return await renderNotices();
  } catch (error) {
    console.error(error);
    app.innerHTML = shell(`<div class="error-panel"><strong>화면을 불러오지 못했습니다.</strong><p>${esc(error.message)}</p><button class="btn" id="retry">다시 시도</button></div>`, '오류');
    bindShell();
    document.querySelector('#retry')?.addEventListener('click', render);
  }
}

async function renderDashboard() {
  await loadDashboard();
  const c = state.dashboard;
  app.innerHTML = shell(`
    <div class="hero-line"><div><h2>무엇을 바꾸시겠습니까?</h2><p>복잡한 설정 없이 사진 교체와 공지 등록만 할 수 있습니다.</p></div></div>
    <div class="grid-2">
      <button type="button" class="action-card" data-go="images"><span class="action-icon">▣</span><h3>사진 바꾸기</h3><p>홈페이지에서 바꿀 위치를 누르고 사진을 올리면, 보기 좋은 보정본을 자동으로 만듭니다.</p><b>사진 위치 선택 →</b></button>
      <button type="button" class="action-card" data-go="notices"><span class="action-icon">✎</span><h3>공지사항 쓰기</h3><p>제목과 내용만 입력하면 홈페이지 디자인에 맞는 공지사항으로 게시됩니다.</p><b>새 공지 작성 →</b></button>
    </div>
    <div class="stat-row">
      <div class="stat"><span>교체 가능한 사진</span><strong>${c.slots}</strong></div>
      <div class="stat"><span>게시 전 사진</span><strong>${c.image_drafts}</strong></div>
      <div class="stat"><span>전체 공지</span><strong>${c.notices}</strong></div>
      <div class="stat"><span>게시 중 공지</span><strong>${c.published_notices}</strong></div>
    </div>
  `, '홈페이지 관리');
  bindShell();
  document.querySelectorAll('[data-go]').forEach((el) => el.addEventListener('click', () => navigate(el.dataset.go)));
}

async function renderImages() {
  await loadSlots();
  const pages = [...new Set(state.slots.map((s) => s.page))];
  if (!pages.includes(state.page)) state.page = pages[0] || 'home';
  const pageSlots = state.slots.filter((s) => s.page === state.page);
  const selected = state.slots.find((s) => s.slot_id === state.selectedSlotId) || null;
  const stageSlots = pageSlots.map((slot) => `
    <button type="button" class="slot-button ${slot.slot_id===state.selectedSlotId?'active':''}" data-slot="${attr(slot.slot_id)}"
      style="left:${slot.x}%;top:${slot.y}%;width:${slot.w}%;height:${slot.h}%" title="${attr(slot.label)}">
      ${slot.active_media_url ? `<img src="${attr(slot.active_media_url)}" alt="">` : ''}<span>${esc(slot.label.replace(/^.*?·\s*/,''))}</span>
    </button>`).join('');
  app.innerHTML = shell(`
    <div class="hero-line"><div><h2>사진 바꾸기</h2><p>화면에서 파란 영역을 누르면 해당 사진만 교체됩니다.</p></div><button class="btn" id="refresh-slots">새로고침</button></div>
    <div class="image-layout">
      <section class="card screen-panel">
        <div class="card-head"><div class="page-tabs">${pages.map((p)=>`<button type="button" data-page="${p}" class="${state.page===p?'active':''}">${esc(PAGE_LABELS[p]||p)}</button>`).join('')}</div></div>
        <div class="card-body"><div class="screen-scroll"><div class="screen-stage"><img src="${SCREEN_PATH(state.page)}" alt="${esc(PAGE_LABELS[state.page])} 현재 화면">${stageSlots}</div></div><p class="hint">파란 영역은 교체 가능한 사진 자리입니다. 현재 게시 이미지가 있는 곳은 실제 교체본이 표시됩니다.</p></div>
      </section>
      <section class="card editor-panel">
        <div class="card-head"><h3>${selected ? esc(selected.label) : '교체할 위치를 선택하세요'}</h3></div>
        <div class="card-body" id="image-editor">${selected ? imageEditorMarkup(selected) : '<div class="empty">왼쪽 홈페이지 화면에서<br>바꿀 사진 위치를 눌러주세요.</div>'}</div>
      </section>
    </div>
  `, '사진 바꾸기');
  bindShell();
  document.querySelectorAll('[data-page]').forEach((button) => button.addEventListener('click', () => { state.page=button.dataset.page; state.selectedSlotId=null; resetImageState(); renderImages(); }));
  document.querySelectorAll('[data-slot]').forEach((button) => button.addEventListener('click', () => { state.selectedSlotId=button.dataset.slot; resetImageState(false); renderImages(); }));
  document.querySelector('#refresh-slots')?.addEventListener('click', async()=>{await loadSlots(true); toast('사진 목록을 새로 불러왔습니다.'); renderImages();});
  if (selected) bindImageEditor(selected);
}

function imageEditorMarkup(slot) {
  const versions = (slot.versions || []).slice(0,8);
  return `
    <div class="field"><label>새 사진 선택</label><div class="dropzone" id="dropzone"><input class="sr-only" type="file" id="image-file" accept="image/jpeg,image/png,image/webp"><button class="btn big" type="button" id="choose-file">사진 선택 또는 촬영</button><p class="hint">JPEG·PNG·WebP, 원본 최대 12MB<br>권장 가로 ${slot.min_width}px 이상</p></div></div>
    <div id="process-area">${state.sourceFile ? candidateMarkup(slot) : ''}</div>
    <div class="field"><label>게시 이력</label>${versions.length ? `<div class="version-list">${versions.map(v=>`<div class="version"><img src="${attr(v.media_url)}" alt=""><div><strong>${esc(presetLabel(v.preset))}</strong><br><span class="badge ${attr(v.status)}">${esc(statusLabel(v.status))}</span><div class="hint">${esc(formatDate(v.created_at))}</div></div><div>${v.status==='draft'?`<button class="btn primary" data-publish="${attr(v.version_id)}">게시</button>`:''}</div></div>`).join('')}</div>`:'<div class="hint">아직 교체 이력이 없습니다. 기존 홈페이지 이미지가 그대로 표시됩니다.</div>'}</div>
    ${versions.some(v=>v.status==='archived') ? '<button class="btn" type="button" id="rollback">이전 게시 이미지로 되돌리기</button>' : ''}
  `;
}

function candidateMarkup(slot) {
  const candidate = state.candidates.get(state.selectedPreset);
  return `
    <div class="field"><label>자동보정 결과</label><div class="preset-grid">${['natural','product','bright'].map((preset)=>`<button type="button" class="preset ${state.selectedPreset===preset?'active':''}" data-preset="${preset}"><canvas data-preview="${preset}"></canvas><strong>${presetLabel(preset)}</strong></button>`).join('')}</div><p class="hint">사진의 실제 제품·설비 형태는 바꾸지 않고 밝기·대비·선명도·크롭만 조정합니다.</p></div>
    <div class="field"><label>사진 중심 맞추기</label><div class="focal-wrap" id="focal-wrap"><canvas id="focal-canvas"></canvas><span class="focal-point" id="focal-point" style="left:${state.focalX*100}%;top:${state.focalY*100}%"></span></div><p class="hint">제품이나 기계가 잘리지 않도록 사진을 누르거나 끌어 중심을 맞추세요.</p></div>
    <div class="field"><label>PC·모바일 잘림 확인</label><div class="compare-row"><div class="compare"><canvas id="desktop-preview"></canvas><b>PC 화면</b></div><div class="compare"><canvas id="mobile-preview"></canvas><b>모바일 화면</b></div></div></div>
    <div class="form-actions"><button class="btn" type="button" id="cancel-image">취소</button><button class="btn primary big" type="button" id="upload-image" ${!candidate?'disabled':''}>보정본 저장</button></div>
  `;
}

function presetLabel(preset) { return ({natural:'자연스럽게', product:'제품이 선명하게', bright:'밝고 깨끗하게'})[preset] || preset; }

function resetImageState(clearFile=true) {
  if (clearFile && state.sourceBitmap?.close) state.sourceBitmap.close();
  if (clearFile) { state.sourceFile=null; state.sourceBitmap=null; }
  state.candidates.clear(); state.selectedPreset='natural'; state.focalX=.5; state.focalY=.5; state.processing=false;
}

function bindImageEditor(slot) {
  const input = document.querySelector('#image-file');
  const choose = document.querySelector('#choose-file');
  const drop = document.querySelector('#dropzone');
  choose?.addEventListener('click', () => input.click());
  input?.addEventListener('change', () => input.files?.[0] && selectFile(input.files[0], slot));
  ['dragenter','dragover'].forEach(type=>drop?.addEventListener(type,(e)=>{e.preventDefault();drop.classList.add('drag');}));
  ['dragleave','drop'].forEach(type=>drop?.addEventListener(type,(e)=>{e.preventDefault();drop.classList.remove('drag');}));
  drop?.addEventListener('drop',(e)=>{const file=e.dataTransfer.files?.[0];if(file)selectFile(file,slot);});
  document.querySelectorAll('[data-publish]').forEach((button)=>button.addEventListener('click',()=>publishVersion(button.dataset.publish)));
  document.querySelector('#rollback')?.addEventListener('click',()=>rollback(slot.slot_id));
  bindCandidateControls(slot);
}

async function selectFile(file, slot) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) return toast('JPEG, PNG, WebP 이미지만 선택해 주세요.','error');
  if (file.size > 12*1024*1024) return toast('원본 사진은 12MB 이하만 사용할 수 있습니다.','error');
  try {
    state.processing=true; state.sourceFile=file;
    if (state.sourceBitmap?.close) state.sourceBitmap.close();
    state.sourceBitmap=await createImageBitmap(file, { imageOrientation:'from-image' });
    if (state.sourceBitmap.width < slot.min_width) toast(`권장 가로 ${slot.min_width}px보다 작아 선명도가 떨어질 수 있습니다.`,'error');
    await buildCandidates(slot);
    await renderImages();
  } catch (error) { console.error(error); toast('사진을 읽거나 보정하지 못했습니다.','error'); }
  finally { state.processing=false; }
}

async function buildCandidates(slot) {
  state.candidates.clear();
  for (const preset of ['natural','product','bright']) {
    const rendered = renderCropCanvas(state.sourceBitmap, slot.aspect_ratio, preset, state.focalX, state.focalY, targetWidth(slot));
    const blob = await canvasBlob(rendered, 'image/webp', .88);
    state.candidates.set(preset, { canvas:rendered, blob, width:rendered.width, height:rendered.height });
  }
}

function targetWidth(slot) { return Math.min(2200, Math.max(slot.min_width, Math.min(state.sourceBitmap.width, 1800))); }

function cropRect(sourceW, sourceH, aspect, focalX, focalY) {
  let w=sourceW, h=w/aspect;
  if (h>sourceH) { h=sourceH; w=h*aspect; }
  const cx=focalX*sourceW, cy=focalY*sourceH;
  const x=Math.max(0,Math.min(sourceW-w,cx-w/2));
  const y=Math.max(0,Math.min(sourceH-h,cy-h/2));
  return {x,y,w,h};
}

function renderCropCanvas(bitmap, aspect, preset, focalX, focalY, outWidth) {
  const crop=cropRect(bitmap.width,bitmap.height,aspect,focalX,focalY);
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(320,Math.round(outWidth)); canvas.height=Math.max(180,Math.round(canvas.width/aspect));
  const ctx=canvas.getContext('2d',{alpha:false});
  ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
  ctx.filter = preset==='product' ? 'brightness(1.02) contrast(1.12) saturate(.96)' : preset==='bright' ? 'brightness(1.11) contrast(1.06) saturate(1.01)' : 'brightness(1.03) contrast(1.04) saturate(1.02)';
  ctx.drawImage(bitmap,crop.x,crop.y,crop.w,crop.h,0,0,canvas.width,canvas.height);
  ctx.filter='none';
  if (preset==='product') sharpenCanvas(ctx,canvas.width,canvas.height,.18);
  return canvas;
}

function sharpenCanvas(ctx,w,h,amount=.15) {
  try {
    const image=ctx.getImageData(0,0,w,h); const src=image.data; const copy=new Uint8ClampedArray(src);
    const stride=w*4;
    for(let y=1;y<h-1;y+=1){for(let x=1;x<w-1;x+=1){const i=y*stride+x*4;for(let c=0;c<3;c+=1){const center=copy[i+c]*5;const around=copy[i-stride+c]+copy[i+stride+c]+copy[i-4+c]+copy[i+4+c];src[i+c]=copy[i+c]*(1-amount)+(center-around)*amount;}}}
    ctx.putImageData(image,0,0);
  } catch (_) { /* canvas memory guard: base rendering remains valid */ }
}

function canvasBlob(canvas,type,quality) { return new Promise((resolve,reject)=>canvas.toBlob((blob)=>blob?resolve(blob):reject(new Error('ENCODE_FAILED')),type,quality)); }

function bindCandidateControls(slot) {
  if (!state.sourceFile) return;
  document.querySelectorAll('[data-preview]').forEach((canvas)=>copyCanvas(state.candidates.get(canvas.dataset.preview)?.canvas,canvas));
  drawFocalSource(); drawResponsivePreviews(slot);
  document.querySelectorAll('[data-preset]').forEach((button)=>button.addEventListener('click',()=>{state.selectedPreset=button.dataset.preset;renderImages();}));
  const focal=document.querySelector('#focal-wrap');
  let dragging=false;
  const move=(event)=>{const rect=focal.getBoundingClientRect();const point=event.touches?.[0]||event;state.focalX=Math.max(0,Math.min(1,(point.clientX-rect.left)/rect.width));state.focalY=Math.max(0,Math.min(1,(point.clientY-rect.top)/rect.height));const marker=document.querySelector('#focal-point');marker.style.left=`${state.focalX*100}%`;marker.style.top=`${state.focalY*100}%`;};
  focal?.addEventListener('pointerdown',(e)=>{dragging=true;focal.setPointerCapture?.(e.pointerId);move(e)});
  focal?.addEventListener('pointermove',(e)=>dragging&&move(e));
  focal?.addEventListener('pointerup',async()=>{dragging=false;await buildCandidates(slot);renderImages();});
  document.querySelector('#cancel-image')?.addEventListener('click',()=>{resetImageState();renderImages();});
  document.querySelector('#upload-image')?.addEventListener('click',()=>uploadCandidate(slot));
}

function copyCanvas(source,target) { if(!source||!target)return; target.width=source.width;target.height=source.height;target.getContext('2d').drawImage(source,0,0); }
function drawFocalSource(){const canvas=document.querySelector('#focal-canvas');if(!canvas||!state.sourceBitmap)return;const max=800;canvas.width=Math.min(max,state.sourceBitmap.width);canvas.height=Math.round(canvas.width*state.sourceBitmap.height/state.sourceBitmap.width);canvas.getContext('2d').drawImage(state.sourceBitmap,0,0,canvas.width,canvas.height);}
function drawResponsivePreviews(slot){const candidate=state.candidates.get(state.selectedPreset);if(!candidate)return;copyCanvas(candidate.canvas,document.querySelector('#desktop-preview'));const mobile=document.querySelector('#mobile-preview');const mobileAspect=Math.min(1.15,Math.max(.8,slot.aspect_ratio*.72));const canvas=renderCropCanvas(state.sourceBitmap,mobileAspect,state.selectedPreset,state.focalX,state.focalY,700);copyCanvas(canvas,mobile);}

async function uploadCandidate(slot) {
  const candidate=state.candidates.get(state.selectedPreset);
  if(!candidate||!state.sourceFile)return;
  const button=document.querySelector('#upload-image'); button.disabled=true; button.textContent='저장 중…';
  try {
    const form=new FormData();
    form.set('original',state.sourceFile,state.sourceFile.name||'original.jpg');
    form.set('processed',candidate.blob,`${slot.slot_id}-${state.selectedPreset}.webp`);
    form.set('preset',state.selectedPreset); form.set('focal_x',String(state.focalX)); form.set('focal_y',String(state.focalY)); form.set('width',String(candidate.width)); form.set('height',String(candidate.height));
    await api(`/admin/slots/${encodeURIComponent(slot.slot_id)}/upload`,{method:'POST',body:form});
    toast('보정본을 안전하게 저장했습니다. 게시 버튼을 눌러야 홈페이지에 반영됩니다.');
    resetImageState(); await loadSlots(true); await loadDashboard(true); renderImages();
  } catch(error){toast(error.message,'error');button.disabled=false;button.textContent='보정본 저장';}
}

async function publishVersion(versionId){if(!confirm('이 보정본을 홈페이지에 게시하시겠습니까?'))return;try{await api(`/admin/versions/${encodeURIComponent(versionId)}/publish`,{method:'POST'});toast('홈페이지에 게시했습니다.');await loadSlots(true);await loadDashboard(true);renderImages();}catch(e){toast(e.message,'error')}}
async function rollback(slotId){if(!confirm('직전에 게시했던 이미지로 되돌리시겠습니까?'))return;try{await api(`/admin/slots/${encodeURIComponent(slotId)}/rollback`,{method:'POST'});toast('이전 이미지로 복구했습니다.');await loadSlots(true);renderImages();}catch(e){toast(e.message,'error')}}

async function renderNotices() {
  await loadNotices();
  const selected=state.notices.find((n)=>String(n.id)===String(state.selectedNoticeId))||null;
  app.innerHTML=shell(`
    <div class="hero-line"><div><h2>공지사항</h2><p>제목과 내용만 입력하면 정해진 홈페이지 서식으로 게시됩니다.</p></div><button class="btn primary big" id="new-notice">새 공지 쓰기</button></div>
    <div class="notice-layout">
      <section class="card"><div class="card-head"><h3>공지 목록</h3><button class="btn" id="refresh-notices">새로고침</button></div><div class="card-body">${noticeListMarkup()}</div></section>
      <section class="card"><div class="card-head"><h3>${selected?'공지 수정':'새 공지 작성'}</h3></div><div class="card-body">${noticeFormMarkup(selected)}</div></section>
    </div>
  `,'공지사항');
  bindShell();
  document.querySelector('#new-notice')?.addEventListener('click',()=>{state.selectedNoticeId=null;state.noticeCoverFile=null;renderNotices();document.querySelector('#notice-title')?.focus();});
  document.querySelector('#refresh-notices')?.addEventListener('click',async()=>{await loadNotices(true);toast('공지 목록을 새로 불러왔습니다.');renderNotices();});
  document.querySelectorAll('[data-notice-id]').forEach((row)=>row.addEventListener('click',()=>{state.selectedNoticeId=row.dataset.noticeId;state.noticeCoverFile=null;renderNotices();}));
  bindNoticeForm(selected);
}

function noticeListMarkup(){
  if(!state.notices.length)return '<div class="empty">등록된 공지사항이 없습니다.</div>';
  return `<table class="notice-table"><thead><tr><th>제목</th><th>상태</th><th>수정일</th></tr></thead><tbody>${state.notices.map(n=>`<tr class="notice-row ${String(n.id)===String(state.selectedNoticeId)?'active':''}" data-notice-id="${n.id}"><td><div class="notice-title">${n.is_pinned?'📌 ':''}${esc(n.title)}</div><div class="notice-meta">${esc((n.body||'').slice(0,55))}${(n.body||'').length>55?'…':''}</div></td><td><span class="badge ${attr(n.status)}">${esc(statusLabel(n.status))}</span></td><td>${esc(formatDate(n.updated_at))}</td></tr>`).join('')}</tbody></table>`;
}

function noticeFormMarkup(notice){
  const n=notice||{title:'',body:'',status:'draft',is_pinned:0,publish_at:''};
  const localDate=n.publish_at?new Date(n.publish_at).toISOString().slice(0,16):'';
  return `
    <form id="notice-form">
      <div class="field"><label for="notice-title">제목</label><input id="notice-title" maxlength="120" required value="${attr(n.title)}" placeholder="예: 여름휴가 일정 안내"></div>
      <div class="field"><label for="notice-body">내용</label><textarea id="notice-body" maxlength="20000" required placeholder="공지 내용을 입력하세요.">${esc(n.body)}</textarea><div class="hint"><span id="body-count">${(n.body||'').length}</span> / 20,000자 · 글꼴과 색상은 홈페이지에 맞게 자동 적용됩니다.</div></div>
      <div class="grid-2"><div class="field"><label for="notice-status">저장 상태</label><select id="notice-status"><option value="draft" ${n.status==='draft'?'selected':''}>임시저장</option><option value="published" ${n.status==='published'?'selected':''}>바로 게시</option><option value="scheduled" ${n.status==='scheduled'?'selected':''}>예약</option><option value="hidden" ${n.status==='hidden'?'selected':''}>숨김</option></select></div><div class="field"><label for="notice-date">예약 게시 시간</label><input type="datetime-local" id="notice-date" value="${attr(localDate)}"></div></div>
      <div class="field"><label for="notice-cover">대표 이미지 <span class="hint">(선택)</span></label><input type="file" id="notice-cover" accept="image/jpeg,image/png,image/webp"><div class="notice-cover-preview" id="notice-cover-preview">${n.cover_url?`<img src="${attr(n.cover_url)}" alt="현재 대표 이미지">`:'대표 이미지를 넣지 않아도 공지를 게시할 수 있습니다.'}</div><div class="hint">선택하면 16:9 비율의 자연스러운 WebP로 정리됩니다.</div></div>
      <label class="switchline"><input type="checkbox" id="notice-pinned" ${n.is_pinned?'checked':''}> 홈페이지 공지 목록 상단에 고정</label>
      <div class="field"><label>미리보기</label><article class="preview-notice"><div id="preview-cover">${n.cover_url?`<img src="${attr(n.cover_url)}" alt="">`:''}</div><h2 id="preview-title">${esc(n.title||'공지 제목')}</h2><p id="preview-body">${esc(n.body||'공지 내용이 여기에 표시됩니다.')}</p></article></div>
      <div class="form-actions">${notice?`<button type="button" class="btn danger" id="delete-notice">휴지통</button>${notice.status==='published'?'<button type="button" class="btn" id="hide-notice">홈페이지에서 숨기기</button>':''}`:''}<button type="submit" class="btn primary big">${notice?'변경 저장':'공지 저장'}</button></div>
    </form>`;
}

function bindNoticeForm(notice){
  const form=document.querySelector('#notice-form'); const title=document.querySelector('#notice-title'); const body=document.querySelector('#notice-body');
  const updatePreview=()=>{document.querySelector('#preview-title').textContent=title.value||'공지 제목';document.querySelector('#preview-body').textContent=body.value||'공지 내용이 여기에 표시됩니다.';document.querySelector('#body-count').textContent=body.value.length;};
  title.addEventListener('input',updatePreview);body.addEventListener('input',updatePreview);
  const coverInput=document.querySelector('#notice-cover');
  coverInput?.addEventListener('change',()=>{const file=coverInput.files?.[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)){coverInput.value='';return toast('대표 이미지는 JPEG, PNG, WebP만 사용할 수 있습니다.','error')}if(file.size>12*1024*1024){coverInput.value='';return toast('대표 이미지는 12MB 이하만 사용할 수 있습니다.','error')}state.noticeCoverFile=file;const url=URL.createObjectURL(file);document.querySelector('#notice-cover-preview').innerHTML=`<img src="${url}" alt="선택한 대표 이미지">`;document.querySelector('#preview-cover').innerHTML=`<img src="${url}" alt="">`;});
  form.addEventListener('submit',async(e)=>{e.preventDefault();const submit=form.querySelector('[type=submit]');submit.disabled=true;const payload={title:title.value,body:body.value,status:document.querySelector('#notice-status').value,is_pinned:document.querySelector('#notice-pinned').checked,publish_at:document.querySelector('#notice-date').value?new Date(document.querySelector('#notice-date').value).toISOString():null};try{const result=await api(notice?`/admin/notices/${notice.id}`:'/admin/notices',{method:notice?'PUT':'POST',body:JSON.stringify(payload)});const savedId=result.id||notice?.id;if(state.noticeCoverFile&&savedId)await uploadNoticeCover(savedId,state.noticeCoverFile);state.noticeCoverFile=null;state.selectedNoticeId=savedId;await loadNotices(true);await loadDashboard(true);toast(payload.status==='published'?'공지사항을 게시했습니다.':'공지사항을 저장했습니다.');renderNotices();}catch(err){toast(err.message,'error');submit.disabled=false}});
  document.querySelector('#hide-notice')?.addEventListener('click',()=>noticeAction(notice.id,'hide','홈페이지에서 공지를 숨기시겠습니까?'));
  document.querySelector('#delete-notice')?.addEventListener('click',()=>noticeAction(notice.id,'delete','공지사항을 휴지통으로 이동하시겠습니까?'));
}
async function uploadNoticeCover(id,file){
  const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
  try{
    if(Math.max(bitmap.width,bitmap.height)<800)throw new Error('대표 이미지는 긴 변이 800px 이상이어야 합니다.');
    const width=Math.min(1600,Math.max(960,bitmap.width));
    const canvas=renderCropCanvas(bitmap,16/9,'natural',.5,.5,width);
    const blob=await canvasBlob(canvas,'image/webp',.88);
    const form=new FormData();form.set('original',file,file.name||'cover.jpg');form.set('processed',blob,`notice-${id}-cover.webp`);
    await api(`/admin/notices/${id}/cover`,{method:'POST',body:form});
  } finally { bitmap.close?.(); }
}

async function noticeAction(id,action,question){if(!confirm(question))return;try{await api(`/admin/notices/${id}/${action}`,{method:'POST'});await loadNotices(true);state.selectedNoticeId=null;toast(action==='delete'?'휴지통으로 이동했습니다.':'홈페이지에서 숨겼습니다.');renderNotices();}catch(e){toast(e.message,'error')}}

(async function init(){
  const initial=location.hash.replace('#','');
  if(['dashboard','images','notices'].includes(initial))state.view=initial;
  app.innerHTML='<div class="loading">관리 화면을 불러오는 중입니다…</div>';
  await render();
})();
