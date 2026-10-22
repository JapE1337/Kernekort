import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Execute the shipped HTML's actual script with a minimal DOM. This catches
// missing module aliases and initialization failures that syntax checks miss.
test('Standalone HTML initializes and searches by name, notation and A/Z',async()=>{
 const html=fs.readFileSync(new URL('../Kernekort.html',import.meta.url),'utf8');
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const nodes=new Map();
 function node(id){if(!nodes.has(id))nodes.set(id,{
  value:id==='digits'?'6':id==='format'?'decimals':'',hidden:false,innerHTML:'',textContent:'',style:{},
  events:{},classList:{toggle(){}},addEventListener(event,handler){this.events[event]=handler;},
  querySelectorAll(){return [];},querySelector(){return null;},focus(){},blur(){},getContext(){return {};},
 });return nodes.get(id);}
 const context=vm.createContext({
  document:{getElementById:node,documentElement:{dataset:{}},querySelectorAll:()=>[],querySelector:()=>node('axis-y'),addEventListener(){},activeElement:{tagName:'BODY'}},
  localStorage:{getItem(){return null;}},window:{devicePixelRatio:1},requestAnimationFrame:()=>1,
  ResizeObserver:class{observe(){}},setTimeout,clearTimeout,console,
 });
 await vm.runInContext(script,context,{timeout:5000});
 assert.equal(node('count').textContent,'3.558');
 assert.ok(node('info').innerHTML.includes('Magnesium-24'));
 assert.equal(node('loading').hidden,true);
 for(const query of ['Mg','Magnesium','Mg-24','²⁴Mg','Z = 12']){
  node('search').value=query;node('search').events.input();
  assert.equal(node('results').hidden,false);
  assert.ok(node('results').innerHTML.includes('Magnesium-24'),query);
 }
 node('search').value='C-14';node('search').events.input();
 node('search').events.keydown({key:'Enter'});
 assert.ok(node('info').innerHTML.includes('Kulstof-14'));
 node('graph-tab').onclick();
 node('mass-number').value='238';node('proton-number').value='92';
 node('number-search').events.submit({preventDefault(){}});
 assert.ok(node('number-feedback').textContent.includes('Uran-238'));
 assert.ok(node('info').innerHTML.includes('Uran-238'));
 node('search').value='Fe-56';node('search').events.input();node('search').events.keydown({key:'Enter'});
 assert.ok(node('info').innerHTML.includes('Jern-56'));
});
