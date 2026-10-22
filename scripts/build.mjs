import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
fs.mkdirSync(path.join(root,'dist/data/raw'),{recursive:true});
for(const file of ['mass_1.mas20.txt','nubase_4.mas20.txt'])fs.copyFileSync(path.join(root,'data/raw',file),path.join(root,'dist/data/raw',file));
console.log('Static distribution ready in dist/; no compilation or external dependencies required.');

await import('./standalone.mjs');

// GitHub Pages publishes this folder from the main branch.
const docs=path.join(root,'docs');
fs.mkdirSync(docs,{recursive:true});
fs.cpSync(path.join(root,'dist'),docs,{recursive:true});
fs.writeFileSync(path.join(docs,'.nojekyll'),'');
console.log('GitHub Pages ready in docs/.');
