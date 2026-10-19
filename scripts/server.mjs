import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
 const url=new URL(req.url,'http://localhost');
 const decoded=decodeURIComponent(url.pathname);
 const raw=decoded.startsWith('/data/raw/');
 const base=raw?path.join(root,'data/raw'):path.join(root,'dist');
 const file=path.resolve(base,'.'+(raw?decoded.slice('/data/raw'.length):decoded==='/'?'/index.html':decoded));
 if(file!==base&&!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}
 const contents=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(contents);
 }catch{res.writeHead(404);res.end('Not found');}
});
const port=Number(process.env.PORT)||4173;
server.listen(port,'127.0.0.1',()=>console.log(`Kernekort: http://localhost:${port}`));
