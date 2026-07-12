import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const candidates=process.platform==='win32'
 ? [
   'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
   'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
   'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
 ] : ['/usr/bin/chromium','/usr/bin/google-chrome'];
const browser=candidates.find(fs.existsSync);
if(!browser){console.error('BROWSER QA HOLD: supported browser executable not found');process.exit(2);}

const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:['ignore','pipe','pipe']});
await new Promise(r=>setTimeout(r,900));
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'dgtc-browser-qa-'));
const args=['--headless=new','--disable-gpu','--no-first-run','--disable-default-apps','--window-size=1440,900',`--user-data-dir=${profile}`,'--virtual-time-budget=2500','--dump-dom','http://127.0.0.1:4173/?qa=1#/home'];
if(process.platform!=='win32')args.unshift('--no-sandbox','--disable-dev-shm-usage');
const child=spawn(browser,args,{stdio:['ignore','pipe','pipe']});
let out='',err='';
child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const timer=setTimeout(()=>child.kill('SIGKILL'),15000);
const code=await new Promise(r=>child.on('close',r));clearTimeout(timer);server.kill();
if(out.includes('data-qa-status="PASS"')||out.includes("data-qa-status='PASS'")){
  console.log('BROWSER QA PASS: real browser route, hit-test, and modal checks');
  process.exit(0);
}
console.error('BROWSER QA HOLD');
console.error(err.slice(-1000));
process.exit(code===0?1:2);
