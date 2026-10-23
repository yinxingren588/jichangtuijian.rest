import fs from 'node:fs';
import crypto from 'node:crypto';
import {pages,origin} from './common';
const manifest=Object.fromEntries(pages().filter(p=>p.$('meta[name="robots"]').attr('content')==='index, follow').map(p=>[origin+p.url,crypto.createHash('sha256').update(fs.readFileSync(p.file)).digest('hex')]));
fs.mkdirSync('.state',{recursive:true});fs.writeFileSync('.state/current.json',JSON.stringify(manifest,null,2));console.log('Change manifest:',Object.keys(manifest).length,'indexable URLs. No notifications sent.');
