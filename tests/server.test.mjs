import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';

test('HTTP serves app, modules, full database and source tables',async()=>{
 const child=spawn(process.execPath,[fileURLToPath(new URL('../scripts/server.mjs',import.meta.url))],{env:{...process.env,PORT:'4188'},stdio:['ignore','pipe','pipe']});
 try{
  await Promise.race([once(child.stdout,'data'),once(child,'error').then(([e])=>{throw e;}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Server startup timed out')),5000))]);
  for(const [route,type] of [['/','text/html'],['/styles.css','text/css'],['/app.mjs','text/javascript'],['/physics.mjs','text/javascript'],['/data/nuclides.json','application/json'],['/data/raw/mass_1.mas20.txt','text/plain'],['/data/raw/nubase_4.mas20.txt','text/plain']]){
   const response=await fetch('http://127.0.0.1:4188'+route,{signal:AbortSignal.timeout(5000)});assert.equal(response.status,200);assert.ok(response.headers.get('content-type').includes(type));const text=await response.text();assert.ok(text.length>100);
   if(route.endsWith('nuclides.json'))assert.equal(JSON.parse(text).nuclides.length,3558);
  }
  assert.equal((await fetch('http://127.0.0.1:4188/missing')).status,404);
  assert.equal((await fetch('http://127.0.0.1:4188/%2e%2e%2fpackage.json')).status,403);
 }finally{child.kill();}
});
