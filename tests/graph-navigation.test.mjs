import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
function setup(){
 const context=vm.createContext({});
 vm.runInContext(`let graph=true,width=900,height=485,scale=3,baseScale=3,originX=55,originY=445,maxN=180,maxZ=118;const graphView={zoom:1,x:0,y:0};function properties(r){return {perA:r.bindingPerA};}function hideTip(){}function schedule(){}`,context);
 for(const name of ['fit','zoom','focus','graphBasePosition','graphPosition']){
  const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+1);
  assert.ok(start>=0&&end>start);vm.runInContext(source.slice(start,end),context);
 }
 return expression=>vm.runInContext(expression,context);
}
test('Curve zoom preserves data position under cursor',()=>{
 const run=setup();
 run('const r={a:56,bindingPerA:8.79};const before=graphPosition(r);zoom(2,before.x,before.y);const after=graphPosition(r);');
 assert.ok(run('Math.abs(before.x-after.x)<1e-9 && Math.abs(before.y-after.y)<1e-9'));
 assert.equal(run('graphView.zoom'),2);
 assert.equal(run('scale'),3);
});
test('Curve pan, reset and focus use same coordinate transform',()=>{
 const run=setup();
 run('const r={a:238,bindingPerA:7.57};const before=graphPosition(r);graphView.x+=80;graphView.y-=35;const after=graphPosition(r);');
 assert.equal(run('after.x-before.x'),80);assert.equal(run('after.y-before.y'),-35);
 run('fit()');assert.equal(run('graphView.zoom'),1);assert.equal(run('graphView.x'),0);assert.equal(run('graphView.y'),0);
 run('focus(r)');assert.equal(run('graphView.zoom'),3);
 assert.ok(run('Math.abs(graphPosition(r).x-(58+width-27)/2)<1e-9'));
 assert.ok(run('Math.abs(graphPosition(r).y-(15+height-42)/2)<1e-9'));
});
test('Curve zoom limits and chart navigation remain separate',()=>{
 const run=setup();run('zoom(1e9)');assert.equal(run('graphView.zoom'),40);run('zoom(1e-9)');assert.equal(run('graphView.zoom'),.7);
 run('graph=false;zoom(2)');assert.equal(run('scale'),6);assert.equal(run('graphView.zoom'),.7);
});
