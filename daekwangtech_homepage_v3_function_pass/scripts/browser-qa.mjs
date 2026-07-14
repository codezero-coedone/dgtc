import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import net from 'net';

const candidates=process.platform==='win32'
 ? [
   'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
   'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
   'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
 ] : ['/usr/bin/chromium','/usr/bin/google-chrome'];
const browser=candidates.find(fs.existsSync);
if(!browser){console.error('BROWSER QA HOLD: supported browser executable not found');process.exit(2);}
const cleanupProfile=profile=>{try{fs.rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:100});}catch{}}

const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:['ignore','pipe','pipe']});
await new Promise(r=>setTimeout(r,900));
async function runCase(name,size,query){
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),`dgtc-browser-qa-${name}-`));
  const args=['--headless=new','--disable-gpu','--no-first-run','--disable-default-apps','--run-all-compositor-stages-before-draw',`--window-size=${size}`,`--user-data-dir=${profile}`,'--virtual-time-budget=8000','--dump-dom',`http://127.0.0.1:4173/?qa=${query}#/home`];
  if(process.platform!=='win32')args.unshift('--no-sandbox','--disable-dev-shm-usage');
  const child=spawn(browser,args,{stdio:['ignore','pipe','pipe']});
  let out='',err='';
  child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
  const timer=setTimeout(()=>child.kill('SIGKILL'),18000);
  const code=await new Promise(r=>child.on('close',r));clearTimeout(timer);
  cleanupProfile(profile);
  const pass=out.includes('data-qa-status="PASS"')||out.includes("data-qa-status='PASS'");
  return {name,pass,code,out,err};
}
async function freePort(){
  return new Promise((resolve,reject)=>{
    const socket=net.createServer();
    socket.once('error',reject);
    socket.listen(0,'127.0.0.1',()=>{const {port}=socket.address();socket.close(()=>resolve(port));});
  });
}
async function runMobileCase(){
  const name='mobile',profile=fs.mkdtempSync(path.join(os.tmpdir(),'dgtc-browser-qa-mobile-')),port=await freePort();
  const args=['--headless=new','--disable-gpu','--no-first-run','--disable-default-apps',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'];
  if(process.platform!=='win32')args.unshift('--no-sandbox','--disable-dev-shm-usage');
  const child=spawn(browser,args,{stdio:['ignore','ignore','pipe']});
  let err='';child.stderr.on('data',d=>err+=d);
  let targets;
  for(let i=0;i<60;i++){
    try{targets=await fetch(`http://127.0.0.1:${port}/json/list`).then(r=>r.json());if(targets.length)break;}catch{}
    await new Promise(r=>setTimeout(r,100));
  }
  const pageTarget=targets?.find(target=>target.type==='page');
  if(!pageTarget){child.kill('SIGKILL');cleanupProfile(profile);return {name,pass:false,code:2,out:'CDP page target unavailable',err};}
  const ws=new WebSocket(pageTarget.webSocketDebuggerUrl),pending=new Map();let id=0;
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  ws.addEventListener('message',event=>{const msg=JSON.parse(event.data);if(msg.id&&pending.has(msg.id)){const {resolve,reject}=pending.get(msg.id);pending.delete(msg.id);msg.error?reject(new Error(msg.error.message)):resolve(msg.result);}});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const call=++id;pending.set(call,{resolve,reject});ws.send(JSON.stringify({id:call,method,params}));});
  let out='',code=0;
  try{
    await send('Page.enable');await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true,screenWidth:390,screenHeight:844});
    await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
    await send('Page.navigate',{url:'http://127.0.0.1:4173/?qa=mobile#/home'});
    for(let i=0;i<100;i++){
      const result=await send('Runtime.evaluate',{expression:"document.querySelector('#qa-result')?.outerHTML||''",returnByValue:true});
      out=result.result.value||'';if(out)break;await new Promise(r=>setTimeout(r,100));
    }
    if(!out){
      const diagnostic=await send('Runtime.evaluate',{expression:"JSON.stringify({href:location.href,ready:document.readyState,width:innerWidth,height:innerHeight,app:typeof window.DGTC_TEST,body:document.body.innerText.slice(0,300)})",returnByValue:true});
      out=`CDP_DIAGNOSTIC ${diagnostic.result.value||''}`;
    }
    if(process.env.DGTC_QA_MOBILE_SCREENSHOT){
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(process.env.DGTC_QA_MOBILE_SCREENSHOT,Buffer.from(shot.data,'base64'));
    }
    if(process.env.DGTC_QA_MOBILE_MODAL_SCREENSHOT){
      await send('Runtime.evaluate',{expression:"window.DGTC_TEST.detail('automotive')"});
      await new Promise(r=>setTimeout(r,300));
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(process.env.DGTC_QA_MOBILE_MODAL_SCREENSHOT,Buffer.from(shot.data,'base64'));
    }
  }catch(error){code=2;err+=`\n${error.stack||error}`;}
  try{await send('Browser.close');}catch{child.kill('SIGKILL');}
  await new Promise(resolve=>{if(child.exitCode!==null)return resolve();child.once('close',resolve);setTimeout(()=>{child.kill('SIGKILL');resolve();},3000);});
  ws.close();cleanupProfile(profile);
  const pass=out.includes('data-qa-status="PASS"')||out.includes("data-qa-status='PASS'");
  return {name,pass,code,out,err};
}
const results=[];
try{
  results.push(await runCase('desktop','1440,900','desktop'));
  results.push(await runMobileCase());
}finally{server.kill();}
if(results.every(x=>x.pass)){
  console.log('BROWSER QA PASS: desktop routes/hit-test/modal and mobile shell/cards/nav/sheet boundaries');
  process.exit(0);
}
console.error('BROWSER QA HOLD');
for(const x of results.filter(x=>!x.pass)){
  console.error(`${x.name} exit=${x.code} stdout=${x.out.length} stderr=${x.err.length}`);
  console.error(x.out.match(/<pre id="qa-result"[\s\S]*?<\/pre>/)?.[0]||x.out.slice(-4000));
  console.error(x.err.slice(-1000));
}
process.exit(results.some(x=>x.code!==0)?2:1);
