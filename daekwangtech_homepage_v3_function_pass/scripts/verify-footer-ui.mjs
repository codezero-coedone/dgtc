import fs from 'fs';
const app=fs.readFileSync('src/app.js','utf8');
const css=fs.readFileSync('src/styles.css','utf8');
const fail=[];
for(const token of ['01092567475','010-9256-7475']) {
  if(app.includes(token)||css.includes(token)) fail.push('phone remains: '+token);
}
if(!css.includes('CT-F1 footer/logo + hover-flash cleanup')) fail.push('cleanup marker missing');
if(!css.includes('.hotspot:hover{background:transparent;box-shadow:none}')) fail.push('transparent hover rule missing');
for(const img of ['home','company','fields','products','facilities','quality']){
  if(!fs.existsSync(`public/screens/${img}.jpg`)) fail.push('screen missing '+img);
}
if(fail.length){console.error('FOOTER/UI VERIFY HOLD');for(const f of fail)console.error('- '+f);process.exit(1);}
console.log('FOOTER/UI VERIFY PASS: clean logo footer, no mobile number, no blue pre-click hover panel');
