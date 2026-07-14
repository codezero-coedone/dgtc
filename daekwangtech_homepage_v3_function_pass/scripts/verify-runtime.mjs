import fs from 'fs';
import vm from 'vm';
const code=fs.readFileSync('src/app.js','utf8');
const store=new Map();
const appNode={innerHTML:'',setAttribute(){},removeAttribute(){}};
class ImageMock{
  constructor(){this.complete=true;this.naturalWidth=1448;this.naturalHeight=1086;this.listeners={};}
  addEventListener(type,fn){this.listeners[type]=fn;}
  set src(value){this.currentSrc=value;queueMicrotask(()=>this.listeners.load?.());}
  decode(){return Promise.resolve();}
}
const doc={
  body:{appendChild(){}},
  getElementById(id){return id==='app'?appNode:null;},
  querySelector(){return null;},
  querySelectorAll(){return [];},
  createElement(){return {className:'',textContent:'',dataset:{},classList:{add(){}},remove(){}};},
  addEventListener(){},
  elementFromPoint(){return null;}
};
const context={
  console,URLSearchParams,FormData:class{},structuredClone:o=>JSON.parse(JSON.stringify(o)),
  Image:ImageMock,
  setTimeout:(fn)=>0,clearTimeout(){},queueMicrotask:fn=>fn(),requestAnimationFrame:fn=>fn(),
  confirm:()=>true,document:doc,window:{addEventListener(){}},matchMedia:()=>({matches:false}),
  location:{hash:'#/home',search:''},
  addEventListener(){},
  localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},
  indexedDB:{open(){throw new Error('IndexedDB should not be reached in public runtime smoke');}},
  URL:{createObjectURL:()=>'',revokeObjectURL(){}}
};
context.window=context;
vm.createContext(context);
try{vm.runInContext(code,context,{timeout:3000});}catch(e){console.error('RUNTIME HOLD boot:',e);process.exit(1);}
const t=context.DGTC_TEST;
const fail=[];
if(!t)fail.push('DGTC_TEST missing');
for(const r of ['home','company','fields','products','facilities','quality']){
  await t.go(r);if(t.route()!==r)fail.push(`route failed ${r}`);
}
for(const key of ['automotive','hydraulic','electronic','mass','products','facilities','quality','process']){
  t.detail(key);if(!context.state?.modal && !appNode.innerHTML.includes('role="dialog"'))fail.push(`detail failed ${key}`);
  t.closeModal();
}
if(fail.length){console.error('RUNTIME HOLD');for(const f of fail)console.error('- '+f);process.exit(1);}
console.log('RUNTIME PASS: boot, six routes, eight detail actions');
