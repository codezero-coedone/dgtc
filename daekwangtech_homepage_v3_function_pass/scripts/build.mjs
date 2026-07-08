import fs from 'fs';
import path from 'path';
const root=process.cwd();
const dist=path.join(root,'dist');
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});
for(const item of ['index.html','src','public','assets']){
  fs.cpSync(path.join(root,item),path.join(dist,item),{recursive:true});
}
console.log('BUILD PASS: Daekwang Tech company-only final package copied to dist/');
console.log('ENTRY: dist/index.html');
