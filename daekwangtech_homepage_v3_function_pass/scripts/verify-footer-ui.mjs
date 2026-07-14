import fs from 'fs';
import crypto from 'crypto';
const app=fs.readFileSync('src/app.js','utf8');
const css=fs.readFileSync('src/styles.css','utf8');
const fail=[];
const screenHashes={
  home:'4B63C8A0977847EBA9961D9031316362ED456CB6C9B9B46BB7F965A1AFB65DD9',
  company:'1AC06430796F667CE93C217FF2D61DB4C42254BE561A6935BBFD512B7B25D9BE',
  fields:'1D92AE2181440169F10F5E16960FF180DF37CAC36E5F790723F5ACF649B09262',
  products:'DEA7890FFB14F881D03F528CD865C676FE48C7980A4BF0997A40E5A54026D823',
  facilities:'E4CF32062E6E8181516C2F78165DC93FAC1FB98212EC6FA33C167542809271CE',
  quality:'10700BE6E2CBC499569ECE6544EF4A336CDE31FB5CDCF8D20531C197C17D9D60'
};
const precisionHashes={
  'precision-shaft.jpg':'C7A08871D9843EC7F93E620D807DE84C40FBF076F3951ED63A033F76D92F8924',
  'threaded-pair.jpg':'EF11E21C93E2BCB051156978610FC50CE18423E4D1FCBF87875CD87C1AAA6EFB',
  'valve-sleeve.jpg':'E194EA7A8F8C6D7E8FF2924483FBB0287C1EEBC77F1A631F93BDFB65A7D25383'
};
for(const token of ['01092567475','010-9256-7475']) {
  if(app.includes(token)||css.includes(token)) fail.push('phone remains: '+token);
}
if(!css.includes('CT-F1 footer/logo + hover-flash cleanup')) fail.push('cleanup marker missing');
if(!css.includes('.hotspot:hover{background:transparent;box-shadow:none}')) fail.push('transparent hover rule missing');
if(!app.includes("DGTC_DESKTOP_PROOF_BREAKOUT_20260714_V3")) fail.push('screen cache-bust authority missing');
for(const marker of ['data-desktop-authority="hybrid"','data-desktop-authority="dom"','home-proof-band','facility-strength-band','quality-dom-hero']){
  if(!app.includes(marker)) fail.push('desktop proof breakout missing: '+marker);
}
if(!css.includes('Desktop raster breakout')) fail.push('desktop raster breakout CSS marker missing');
for(const [img,expected] of Object.entries(screenHashes)){
  const file=`public/screens/${img}.jpg`;
  if(!fs.existsSync(file)){fail.push('screen missing '+img);continue;}
  const actual=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
  if(actual!==expected) fail.push(`screen authority drift ${img}: ${actual}`);
}
for(const [img,expected] of Object.entries(precisionHashes)){
  const file=`public/precision-assets/${img}`;
  if(!fs.existsSync(file)){fail.push(`precision asset missing ${img}`);continue;}
  const actual=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
  if(actual!==expected) fail.push(`precision asset drift ${img}: ${actual}`);
}
if(fail.length){console.error('FOOTER/UI VERIFY HOLD');for(const f of fail)console.error('- '+f);process.exit(1);}
console.log('FOOTER/UI VERIFY PASS: source screens locked, desktop proof breakout active, precision assets locked, clean footer, no blue pre-click hover panel');
