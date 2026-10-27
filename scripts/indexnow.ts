import fs from 'node:fs';
import {origin} from './common';
import {changedUrls,validateUrls,indexNowResponseAction} from './indexnow-lib';
const args=process.argv.slice(2);const current:Record<string,string>=JSON.parse(fs.readFileSync('.state/current.json','utf8'));
const config=JSON.parse(fs.readFileSync('indexnow.config.json','utf8'));const key=process.env.INDEXNOW_KEY||config.key;
if(!/^[A-Za-z0-9-]{8,128}$/.test(key))throw Error('Invalid key');
if(fs.readFileSync('public/'+key+'.txt','utf8').trim()!==key)throw Error('Key file mismatch');
const previous:Record<string,string>=fs.existsSync('.state/submitted.json')?JSON.parse(fs.readFileSync('.state/submitted.json','utf8')):{};
let urls:string[]=[];if(args.includes('--changed')){if(!Object.keys(previous).length)throw Error('No prior submission baseline. Seed with --url or --file after deployment.');urls=changedUrls(current,previous);}else if(args.includes('--url')){urls=[args[args.indexOf('--url')+1]];}else if(args.includes('--file')){urls=fs.readFileSync(args[args.indexOf('--file')+1],'utf8').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);}else{throw Error('Use --url https://jichangtuijian.rest/path/ OR --file changed-urls.txt OR --changed. No blanket submit.');}
urls=validateUrls(urls,current,origin);if(!urls.length){console.log('No changed URLs.');process.exit(0);}
if(args.includes('--dry-run')){console.log(JSON.stringify({host:new URL(origin).host,keyLocation:origin+'/'+key+'.txt',urlList:urls},null,2));process.exit(0);}
const keyLocation=origin+'/'+key+'.txt';const response=await fetch(keyLocation,{signal:AbortSignal.timeout(15000),redirect:'error'});if(!response.ok||(await response.text()).trim()!==key)throw Error('Production verification key is not deployed');
const log=(entry:unknown)=>fs.appendFileSync('.state/indexnow.log',JSON.stringify({time:new Date().toISOString(),...entry as object})+'\n');
for(let offset=0;offset<urls.length;offset+=10000){
 const batch=urls.slice(offset,offset+10000);let success=false;
 for(let attempt=1;attempt<=4;attempt++){
  let delay=Math.min(1000*2**attempt,8000);
  try{
   const r=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({host:new URL(origin).host,key,keyLocation,urlList:batch}),signal:AbortSignal.timeout(15000)});
   const body=(await r.text()).slice(0,2000);const action=indexNowResponseAction(r.status,body);
   log({attempt,status:r.status,urls:batch,response:body,action});
   if(action==='accepted'){success=true;break;}
   if(action==='rejected')throw Error('Permanent rejection '+r.status);
   if(action==='verification-pending'){delay=30000;console.log('IndexNow site verification pending; waiting before bounded retry.');}
  }catch(e){log({attempt,error:String(e),urls:batch});if(String(e).includes('Permanent rejection'))throw e;}
  if(attempt<4)await new Promise(resolve=>setTimeout(resolve,delay));
 }
 if(!success)throw Error('Failed after bounded retries; previous baseline preserved');
 for(const url of batch)previous[url]=current[url];
 fs.writeFileSync('.state/submitted.json',JSON.stringify(previous,null,2));
}
console.log('Notification accepted. This does not mean Bing has indexed or ranked the URLs.');
