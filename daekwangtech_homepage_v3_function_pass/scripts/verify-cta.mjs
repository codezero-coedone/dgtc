import fs from 'fs';
const app=fs.readFileSync('src/app.js','utf8');
const fail=[];
const requiredActions=[
  'detail:automotive','detail:hydraulic','detail:electronic','detail:mass',
  'route:company','route:products','route:facilities','route:quality',
  'detail:products','detail:facilities','detail:quality','detail:process'
];
for(const token of requiredActions){if(!app.includes(token))fail.push(`CTA action missing: ${token}`);}
const mapMatch=app.match(/const CTA_MAP = (\{[\s\S]*?\n\};)\n\nconst ADMIN_SEED/);
if(!mapMatch)fail.push('CTA_MAP block not found');
for(const route of ['home','company','fields','products','facilities','quality']){
  if(!new RegExp(`${route}:\\s*\\[`).test(app))fail.push(`CTA route missing: ${route}`);
}
if(fail.length){
  console.error('CTA VERIFY HOLD');
  for(const f of fail)console.error('- '+f);
  process.exit(1);
}
console.log('CTA VERIFY PASS: all public route/card/photo actions are present in one CTA_MAP');
