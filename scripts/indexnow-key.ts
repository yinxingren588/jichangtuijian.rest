import fs from 'node:fs';
import crypto from 'node:crypto';
if(fs.existsSync('indexnow.config.json')){console.log('Key configuration already exists; no rotation performed.');}else{const key=crypto.randomBytes(16).toString('hex');fs.writeFileSync('indexnow.config.json',JSON.stringify({key},null,2)+'\n');fs.mkdirSync('public',{recursive:true});fs.writeFileSync('public/'+key+'.txt',key);console.log('Public verification key and configuration created. Rebuild and deploy before submission.');}
