(function DGTC_CMS_EXTENSION(){
  'use strict';
  const API='/api/cms';
  const state={bootstrap:null,loading:null,lastHash:'',observer:null};
  const MOBILE_MAP={
    home:{
      'product-cnc-precision-shaft-01.jpg':'home.automotive',
      'product-hydraulic-cartridge-valve.jpg':'home.hydraulic',
      'product-precision-sleeve.jpg':'home.electronic',
      'product-cnc-precision-shaft-02.jpg':'home.mass',
      'cnc-line.jpg':'home.facilities',
      'inspection.jpg':'home.quality'
    },
    company:{'company-front.jpg':'company.hero'},
    fields:{
      'product-cnc-precision-shaft-01.jpg':'fields.automotive',
      'product-hydraulic-cartridge-valve.jpg':'fields.hydraulic',
      'product-precision-sleeve.jpg':'fields.electronic',
      'product-cnc-precision-shaft-02.jpg':'fields.mass'
    },
    products:{
      'product-cnc-precision-shaft-01.jpg':'products.grid1',
      'product-cnc-precision-shaft-02.jpg':'products.grid2',
      'product-hydraulic-cartridge-valve.jpg':'products.grid3',
      'product-hydraulic-fitting-adapter.jpg':'products.grid4',
      'product-hydraulic-valve-sleeve.jpg':'products.grid5',
      'product-hydraulic-valve-spool-01.jpg':'products.grid6'
    },
    facilities:{'cnc-line.jpg':'facilities.line','inspection.jpg':'facilities.measure','jig.jpg':'facilities.tooling','cleaning.jpg':'facilities.clean'},
    quality:{'inspection.jpg':'quality.lab'}
  };
  const pageFromHash=()=>{const clean=(location.hash||'#/home').replace(/^#\/?/,'').split(/[/?]/)[0];return ['home','company','fields','products','facilities','quality'].includes(clean)?clean:'home'};
  const escapeHtml=(v)=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const formatDate=(v)=>{const d=new Date(v);return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium'}).format(d)};

  async function loadBootstrap(force=false){
    if(state.bootstrap&&!force)return state.bootstrap;
    if(state.loading&&!force)return state.loading;
    state.loading=fetch(`${API}/public/bootstrap`,{headers:{accept:'application/json'}}).then(r=>r.ok?r.json():Promise.reject(new Error(`CMS ${r.status}`))).then(data=>{if(!data.ok)throw new Error('CMS unavailable');state.bootstrap=data;return data}).catch(err=>{console.warn('DGTC_CMS_FALLBACK',err);return null}).finally(()=>{state.loading=null});
    return state.loading;
  }

  function findScreenImage(page){
    const images=[...document.querySelectorAll('img')];
    const exact=images.find(img=>{const src=(img.getAttribute('src')||'').toLowerCase();return src.includes(`/screens/${page}.jpg`)||src.endsWith(`${page}.jpg`)});
    if(exact)return exact;
    if(window.matchMedia?.('(max-width: 767px)').matches)return null;
    return images.filter(img=>img.naturalWidth>900&&img.naturalHeight>500).sort((a,b)=>(b.clientWidth*b.clientHeight)-(a.clientWidth*a.clientHeight))[0]||null;
  }

  function applyMobileImages(){
    const data=state.bootstrap;if(!data)return;
    const page=pageFromHash();const mapping=MOBILE_MAP[page]||{};
    const active=new Map(data.slots.filter(s=>s.media_url).map(s=>[s.slot_id,s]));
    for(const img of document.querySelectorAll('img:not(.dgtc-cms-slot img)')){
      const current=img.dataset.dgtcOriginalSrc||img.getAttribute('src')||'';
      const clean=current.split('?')[0].split('#')[0];const basename=clean.slice(clean.lastIndexOf('/')+1);
      const slotId=mapping[basename];if(!slotId)continue;
      const slot=active.get(slotId);if(!slot)continue;
      if(!img.dataset.dgtcOriginalSrc)img.dataset.dgtcOriginalSrc=current;
      if(img.dataset.dgtcSlotVersion===String(slot.version_id||slot.media_url))continue;
      img.dataset.dgtcSlotVersion=String(slot.version_id||slot.media_url);
      img.style.objectPosition=`${Number(slot.focal_x??.5)*100}% ${Number(slot.focal_y??.5)*100}%`;
      img.addEventListener('error',()=>{const original=img.dataset.dgtcOriginalSrc;if(original&&img.getAttribute('src')!==original)img.setAttribute('src',original)},{once:true});
      img.setAttribute('src',slot.media_url);
    }
  }

  function applyImageSlots(){
    const data=state.bootstrap;if(!data)return;
    const page=pageFromHash();
    const image=findScreenImage(page);if(!image||!image.parentElement)return;
    const parent=image.parentElement;
    const style=getComputedStyle(parent);if(style.position==='static')parent.style.position='relative';
    parent.querySelectorAll(':scope > .dgtc-cms-layer').forEach(n=>n.remove());
    const layer=document.createElement('div');layer.className='dgtc-cms-layer';layer.setAttribute('aria-hidden','true');
    for(const slot of data.slots.filter(s=>s.page===page&&s.media_url)){
      const box=document.createElement('div');box.className='dgtc-cms-slot';box.style.cssText=`left:${slot.x}%;top:${slot.y}%;width:${slot.w}%;height:${slot.h}%`;
      const overlay=document.createElement('img');overlay.src=slot.media_url;overlay.alt='';overlay.loading='eager';overlay.decoding='async';overlay.style.objectPosition=`${Number(slot.focal_x??.5)*100}% ${Number(slot.focal_y??.5)*100}%`;
      overlay.addEventListener('error',()=>box.remove(),{once:true});box.append(overlay);layer.append(box);
    }
    if(layer.childElementCount)parent.append(layer);
  }

  function ensureNoticeEntry(){
    if(document.querySelector('.dgtc-cms-notice-entry'))return;
    const link=document.createElement('a');link.className='dgtc-cms-notice-entry';link.href='#/notice';link.textContent='공지사항';link.setAttribute('aria-label','대광테크 공지사항 보기');document.body.append(link);
  }

  function mountLatestNotices(){
    const data=state.bootstrap;if(!data?.notices?.length||pageFromHash()!=='home'||document.querySelector('.dgtc-cms-latest'))return;
    const app=document.querySelector('#app')||document.body;
    const section=document.createElement('section');section.className='dgtc-cms-latest';section.setAttribute('aria-label','최근 공지사항');
    section.innerHTML=`<div class="dgtc-cms-latest__card"><div class="dgtc-cms-latest__head"><h2>공지사항</h2><a href="#/notice">전체보기 →</a></div>${data.notices.map(n=>`<a class="dgtc-cms-latest__item" href="#/notice/${encodeURIComponent(n.slug||n.id)}"><span>${n.is_pinned?'<b class="dgtc-notice-pin">공지</b>':''}${escapeHtml(n.title)}</span><time>${escapeHtml(formatDate(n.published_at))}</time></a>`).join('')}</div>`;
    app.append(section);
  }

  function noticeShell(inner){return `<main class="dgtc-notices"><div class="dgtc-notices__wrap"><a class="dgtc-notices__back" href="#/home">← 홈페이지로 돌아가기</a><section class="dgtc-notices__hero"><small>DAEKWANG TECH</small><h1>공지사항</h1><p>대광테크의 새로운 소식과 주요 안내를 확인하세요.</p></section>${inner}</div></main>`}
  async function renderNoticeRoute(){
    const app=document.querySelector('#app');if(!app)return;
    const clean=(location.hash||'').replace(/^#\/?/,'');const parts=clean.split('/');
    app.innerHTML=noticeShell('<div class="dgtc-notice-empty">공지사항을 불러오는 중입니다…</div>');
    try{
      if(parts.length>1&&parts[1]){
        const r=await fetch(`${API}/public/notices/${encodeURIComponent(parts[1])}`);const data=await r.json();if(!r.ok||!data.ok)throw new Error('공지사항을 찾을 수 없습니다.');const n=data.notice;
        app.innerHTML=noticeShell(`<article class="dgtc-notice-detail">${n.cover_url?`<img class="dgtc-notice-detail__cover" src="${escapeHtml(n.cover_url)}" alt="">`:''}<h1>${n.is_pinned?'<span class="dgtc-notice-pin">공지</span>':''}${escapeHtml(n.title)}</h1><div class="dgtc-notice-detail__meta">${escapeHtml(formatDate(n.published_at))}</div><div class="dgtc-notice-detail__body">${escapeHtml(n.body)}</div></article>`);
      }else{
        const r=await fetch(`${API}/public/notices?limit=50`);const data=await r.json();if(!r.ok||!data.ok)throw new Error('공지사항을 불러오지 못했습니다.');
        const rows=data.notices.length?`<div class="dgtc-notice-list">${data.notices.map(n=>`<a class="dgtc-notice-row" href="#/notice/${encodeURIComponent(n.slug||n.id)}"><span class="dgtc-notice-row__id">${String(n.id).padStart(3,'0')}</span><span><span class="dgtc-notice-row__title">${n.is_pinned?'<b class="dgtc-notice-pin">공지</b>':''}${escapeHtml(n.title)}</span><span class="dgtc-notice-row__excerpt">${escapeHtml(n.excerpt||'')}</span></span><time class="dgtc-notice-row__date">${escapeHtml(formatDate(n.published_at))}</time></a>`).join('')}</div>`:'<div class="dgtc-notice-empty">현재 등록된 공지사항이 없습니다.</div>';
        app.innerHTML=noticeShell(rows);
      }
    }catch(err){console.warn(err);app.innerHTML=noticeShell(`<div class="dgtc-notice-empty"><strong>공지사항을 표시하지 못했습니다.</strong><br>잠시 후 다시 확인해 주세요.</div>`)}
  }

  async function apply(){
    const hash=location.hash||'#/home';
    if(hash.startsWith('#/notice')||hash.startsWith('#notice')){ensureNoticeEntry();return renderNoticeRoute()}
    await loadBootstrap();
    window.requestAnimationFrame(()=>{applyMobileImages();applyImageSlots();ensureNoticeEntry();mountLatestNotices()});
  }

  function scheduleApply(){clearTimeout(scheduleApply.t);scheduleApply.t=setTimeout(apply,80)}
  window.addEventListener('hashchange',scheduleApply);
  window.addEventListener('DOMContentLoaded',scheduleApply,{once:true});
  state.observer=new MutationObserver((records)=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('dgtc-cms-layer'))))scheduleApply()});
  state.observer.observe(document.documentElement,{childList:true,subtree:true});
  scheduleApply();
})();
