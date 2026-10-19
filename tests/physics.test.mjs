import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {properties,search,findByNumbers,CONSTANTS} from '../dist/physics.mjs';
const {nuclides:rows,meta}=JSON.parse(fs.readFileSync(new URL('../dist/data/nuclides.json',import.meta.url)));
const raw=fs.readFileSync(new URL('../data/raw/mass_1.mas20.txt',import.meta.url),'utf8').split(/\r?\n/);
const examples=[['H',1],['H',2],['H',3],['He',4],['C',12],['C',14],['O',16],['Mg',24],['Fe',56],['Ni',62],['Co',60],['Pb',208],['U',235],['U',238]];
for(const [symbol,a] of examples)test(`${symbol}-${a}: official mass, energies and units`,()=>{
 const r=rows.find(r=>r.symbol===symbol&&r.a===a);assert.ok(r);
 // Read official fields directly, independently of the generated database.
 const line=raw[r.ameLine-1];
 const m=Number(line.slice(106,109))+Number(line.slice(110,123))/1e6;
 const perA=Number(line.slice(54,67))/1000;
 assert.equal(r.mass,m);assert.equal(r.bindingPerA,perA);
 const p=properties(r);assert.ok(Math.abs(p.total-perA*a)<1e-9);
 const delta=r.z*CONSTANTS.hydrogen+r.n*CONSTANTS.neutron-m;
 assert.equal(p.defect,delta);assert.equal(p.calculated,delta*CONSTANTS.mevPerU);
 // Constants in brief differ slightly from AME2020; bound difference, not equality.
 assert.ok(Math.abs(p.calculated-p.total)<0.00015,`${p.calculated-p.total} MeV`);
 assert.ok(Math.abs((m-a)*CONSTANTS.mevPerU-r.massExcess/1000)<0.00002);
 assert.equal(p.evaluated,true);
});
test('Complete import, identity, source lines, no fabricated masses',()=>{
 assert.equal(rows.length,3558);assert.equal(meta.count,rows.length);
 assert.equal(new Set(rows.map(r=>`${r.z}:${r.a}`)).size,rows.length);
 const nubase=fs.readFileSync(new URL('../data/raw/nubase_4.mas20.txt',import.meta.url),'utf8').split(/\r?\n/);
 assert.equal(rows.length,nubase.filter(l=>/^\d{3} \d{3}0/.test(l)).length);
 for(const r of rows){assert.equal(r.a,r.z+r.n);assert.ok(r.ameLine);assert.ok(r.nubaseLine);assert.ok(Number.isFinite(r.mass));assert.equal(r.stable,r.halfLife==='stbl');}
 assert.ok(rows.some(r=>r.massEstimated));assert.ok(rows.some(r=>!r.stable));
});
test('Search notation, Danish names, Z and element isotopes',()=>{
 const names=[];names[12]='Magnesium';
 for(const q of ['Mg-24','²⁴Mg','24Mg','mg 24'])assert.equal(search(rows,q,names)[0].a,24);
 for(const q of ['Mg','Magnesium','Z = 12','Z12','12']){const results=search(rows,q,names);assert.ok(results.length>20);assert.ok(results.every(r=>r.z===12));}
 assert.equal(search(rows,'not-a-nuclide',names).length,0);
});
test('Missing mass / energy stays unavailable; evaluated data preferred',()=>{
 const r={z:12,n:12,a:24,mass:null,bindingPerA:null};assert.equal(properties(r).defect,null);assert.equal(properties(r).total,null);
 assert.equal(properties({...r,bindingPerA:8}).total,192);
 assert.equal(properties({...r,mass:23.985,bindingPerA:null}).evaluated,false);
});
test('Find nuclides by mass number A and proton number Z',()=>{
 assert.equal(findByNumbers(rows,'24','12').symbol,'Mg');
 assert.equal(findByNumbers(rows,10,6).symbol,'C');
 assert.equal(findByNumbers(rows,238,92).n,146);
 assert.equal(findByNumbers(rows,1,0).symbol,'n');
 for(const [a,z] of [[12,24],[24,12.5],['',12],[24,''],[0,0],[24,-1],[999,12],['abc',12]])assert.equal(findByNumbers(rows,a,z),null);
});
test('Magnesium fixture and stable/radioactive classifications',()=>{
 const mg=rows.find(r=>r.symbol==='Mg'&&r.a===24);assert.equal(mg.mass,23.985041689);assert.ok(Math.abs(properties(mg).total-198.2570472)<1e-10);assert.ok(mg.stable);
 assert.equal(rows.find(r=>r.symbol==='C'&&r.a===14).stable,false);
 assert.equal(rows.find(r=>r.symbol==='U'&&r.a===238).halfLifeUnit,'Gy');
});

