import {comparisonMode,selectedBrandSlugs,type CompareMode} from './comparison-fields';
export const memoryKey='route-notes:brand-memory:v1';
export interface BrandIdentity {slug:string;name:string}
export interface SavedComparison {brands:string[];view:CompareMode}
export interface BrandMemory {version:1;candidates:string[];recent:string[];comparison:SavedComparison|null}
export function emptyBrandMemory():BrandMemory{return {version:1,candidates:[],recent:[],comparison:null};}
function validSlugs(value:unknown,brands:BrandIdentity[],limit:number):string[]{
 return Array.isArray(value)?[...new Set(value.filter((s):s is string=>typeof s==='string'&&brands.some(b=>b.slug===s)))].slice(0,limit):[];
}
export function parseBrandMemory(raw:string|null,brands:BrandIdentity[]):BrandMemory{
 try{const data=JSON.parse(raw||'null');if(!data||data.version!==1)return emptyBrandMemory();
  const comparison=data.comparison&&typeof data.comparison==='object'?data.comparison:null;
  const selected=validSlugs(comparison?.brands,brands,4);
  return {version:1,candidates:validSlugs(data.candidates,brands,4),recent:validSlugs(data.recent,brands,6),comparison:selected.length>=2?{brands:selected,view:comparisonMode(comparison.view)}:null};
 }catch{return emptyBrandMemory();}
}
export function recordBrandVisit(memory:BrandMemory,slug:string,brands:BrandIdentity[]):BrandMemory{
 if(!brands.some(b=>b.slug===slug))return memory;
 return {...memory,recent:[slug,...memory.recent.filter(s=>s!==slug)].slice(0,6)};
}
export function toggleCandidate(memory:BrandMemory,slug:string,brands:BrandIdentity[]):{memory:BrandMemory;full:boolean}{
 if(!brands.some(b=>b.slug===slug))return {memory,full:false};
 if(memory.candidates.includes(slug))return {memory:{...memory,candidates:memory.candidates.filter(s=>s!==slug)},full:false};
 if(memory.candidates.length>=4)return {memory,full:true};
 return {memory:{...memory,candidates:[...memory.candidates,slug]},full:false};
}
export function comparisonSearch(slugs:string[],view:CompareMode,brands:BrandIdentity[]):string{
 const selected=selectedBrandSlugs(slugs.join(','),brands),params=new URLSearchParams();
 if(selected.length)params.set('brands',selected.join(','));if(view!=='plans')params.set('view',view);
 const query=params.toString();return query?'?'+query:'';
}
export function createBrandMemoryStore(brands:BrandIdentity[]){
 let fallback=emptyBrandMemory(),available=true;
 function read(){if(!available)return fallback;try{fallback=parseBrandMemory(localStorage.getItem(memoryKey),brands);}catch{available=false;}return fallback;}
 function write(memory:BrandMemory){fallback=memory;try{localStorage.setItem(memoryKey,JSON.stringify(memory));}catch{available=false;}
  window.dispatchEvent(new CustomEvent('brand-memory-change'));return available;
 }
 return {read,write,get available(){return available;}};
}
