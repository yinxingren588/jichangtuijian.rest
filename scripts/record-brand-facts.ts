import fs from 'node:fs';
import {airports} from '../src/data/airports';
import {appendFactRecord,type BrandHistory} from '../src/lib/brand-history';

const args=process.argv.slice(2);
const option=(name:string)=>{const index=args.indexOf(name);return index<0?undefined:args[index+1];};
const slug=option('--brand'),date=option('--date'),note=option('--note');
const brand=airports.find(item=>item.slug===slug);
if(!brand||!date||!note)throw Error('用法：npm run brand:record -- --brand 品牌slug --date YYYY-MM-DD --note "此次修改的依据与说明"');
const path='src/data/brand-fact-history.json';
const history=JSON.parse(fs.readFileSync(path,'utf8')) as BrandHistory;
const next=appendFactRecord(history,brand,date,note);
fs.writeFileSync(path,JSON.stringify(next,null,2)+'\n');
console.log(`${brand.name}：已追加资料变更记录，原有快照保留。请审阅选购结论与固定文案后重新构建。`);
