export interface CsvTable {headers:string[];rows:string[][];delimiter:string}
export interface ReviewMapping {query:number;page:number;impressions:number;clicks:number;position:number}
export interface SearchObservation {query:string;page:string;impressions:number;clicks:number;position:number|null;ctr:number|null}
export interface ReviewSettings {minimumImpressions:number;targetCtr:number}

export function parseReviewCsv(input:string):CsvTable {
 if(input.length>5_000_000)throw Error('文件超过5MB，请导出较小的查询或页面数据表。');
 const text=input.replace(/^\uFEFF/,'');
 let quoted=false;const counts=new Map([',','\t',';'].map(char=>[char,0]));
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){i++;continue;}quoted=!quoted;}else if(!quoted){if(c==='\n'||c==='\r')break;if(counts.has(c))counts.set(c,counts.get(c)!+1);}}
 const delimiter=[...counts].sort((a,b)=>b[1]-a[1])[0][0];
 const records:string[][]=[];let row:string[]=[],value='',state:'plain'|'quoted'|'after'='plain';
 const field=()=>{row.push(value);value='';state='plain';};
 const line=()=>{field();if(row.some(cell=>cell.trim()))records.push(row);row=[];};
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(state==='quoted'){if(c==='"'){if(text[i+1]==='"'){value+='"';i++;}else state='after';}else value+=c;continue;}
  if(c===delimiter){field();continue;}
  if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;line();continue;}
  if(state==='after'){if(/\s/.test(c))continue;throw Error('CSV引号后的字符无法识别，请检查导出格式。');}
  if(c==='"'){if(value)throw Error('CSV字段中的引号需要双写转义。');state='quoted';}else value+=c;
 }
 if(state==='quoted')throw Error('CSV引号未闭合。');
 if(value||row.length||state==='after')line();
 if(records.length<2)throw Error('文件只有表头或为空，尚无可分析数据。');
 if(records.length>10001)throw Error('单次最多分析10000行，请按观察范围分别导出。');
 const headers=records.shift()!.map(v=>v.trim());
 if(new Set(headers).size!==headers.length)throw Error('CSV存在重复表头，请先区分列名。');
 if(records.some(record=>record.length!==headers.length))throw Error('CSV各行列数不一致，请导出单一查询或页面表。');
 return {headers,rows:records,delimiter};
}

export function suggestReviewMapping(headers:string[]):ReviewMapping {
 const n=(value:string)=>value.toLowerCase().replace(/[\s_\-（）()]/g,'');
 const find=(aliases:string[])=>headers.findIndex(header=>aliases.map(n).includes(n(header)));
 return {query:find(['关键词','查询','搜索词','Query','Queries','Top queries']),page:find(['页面URL','主要目标URL','页面','URL','Page','Pages','Top pages']),impressions:find(['展现','展示次数','曝光量','Bing展现','Impressions']),clicks:find(['点击','点击次数','Bing点击','Clicks']),position:find(['平均位置','平均排名','Bing平均位置','Average position','Avg. position','Position'])};
}
function metric(value:string,integer:boolean,nullable=false):number|null {
 const raw=value.trim();
 if(nullable&&(!raw||raw==='-'||raw==='—'))return null;
 const normalized=/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(raw)?raw.replaceAll(',',''):raw;
 if(!/^\d+(\.\d+)?$/.test(normalized))throw Error('数值须使用非负数字、小数点或完整的千位分组。');
 const result=Number(normalized);
 if(!Number.isFinite(result)||result>Number.MAX_SAFE_INTEGER||integer&&!Number.isInteger(result))throw Error('展现和点击应为非负整数，数值不能超过安全范围。');
 return result;
}
export function observationsFromCsv(table:CsvTable,mapping:ReviewMapping):SearchObservation[] {
 if(mapping.query<0&&mapping.page<0)throw Error('至少选择关键词列或页面URL列。');
 if(mapping.impressions<0||mapping.clicks<0)throw Error('请选择展现与点击列。');
 for(const index of Object.values(mapping))if(!Number.isInteger(index)||index<-1||index>=table.headers.length)throw Error('字段映射超出CSV列范围。');
 const assigned=Object.values(mapping).filter(index=>index>=0);if(new Set(assigned).size!==assigned.length)throw Error('同一列不能映射成多个不同字段。');
 const seen=new Set<string>();
 return table.rows.map((row,i)=>{
  try{
   const query=mapping.query<0?'':row[mapping.query].trim();const rawPage=mapping.page<0?'':row[mapping.page].trim();
   if(!query&&!rawPage)throw Error('关键词与页面URL不能同时为空。');
   let page='';if(rawPage){const url=new URL(rawPage,'https://jichangtuijian.rest');if(url.origin!=='https://jichangtuijian.rest'||url.username||url.password||url.hash)throw Error('页面URL必须是本站HTTPS地址，且不含凭据或片段。');page=url.href;}
   const impressions=metric(row[mapping.impressions],true)!;const clicks=metric(row[mapping.clicks],true)!;
   if(clicks>impressions)throw Error('点击不能大于同一行展现，请检查映射或统计口径。');
   let position=mapping.position<0?null:metric(row[mapping.position],false,true);
   if(position===0&&impressions===0)position=null;
   if(position!==null&&(position<1||position>10000))throw Error('有数据的平均位置应至少为1；无数据请留空。');
   const key=JSON.stringify([query,page]);if(seen.has(key))throw Error('出现重复查询/页面组合，请导出单一观察范围，避免直接叠加或平均。');seen.add(key);
   return {query,page,impressions,clicks,position,ctr:impressions?clicks/impressions:null};
  }catch(error){throw Error(`第${i+2}行：${error instanceof Error?error.message:'数据格式错误'}`);}
 });
}
export function reviewRecommendation(row:SearchObservation,settings:ReviewSettings):{priority:number;action:string;reason:string} {
 if(!Number.isInteger(settings.minimumImpressions)||settings.minimumImpressions<1||settings.minimumImpressions>1_000_000||!Number.isFinite(settings.targetCtr)||settings.targetCtr<0||settings.targetCtr>1)throw Error('请检查展现参考线与点击率参考线。');
 if(row.impressions===0)return {priority:4,action:'核对抓取与索引状态',reason:'零展现不能单独证明未收录；到站长工具检查具体URL状态。'};
 if(row.impressions<settings.minimumImpressions)return {priority:5,action:'继续积累同口径数据',reason:'低于本次筛选参考线，不据少量样本批量改标题。'};
 if(row.position===null)return {priority:3,action:'补齐平均位置字段',reason:'先核对导出表和字段映射，再判断标题或内容问题。'};
 if(row.position>20)return {priority:2,action:'核对意图与原创证据',reason:'查看页面是否回答该查询的实际问题，再补对应资料；平均位置不是固定个人搜索名次。'};
 if(row.position>10)return {priority:1,action:'补强回答与相关内链',reason:'优先完善该问题的答案、证据和阅读路径，不把平均位置解释成固定第几页。'};
 if(row.ctr!==null&&row.ctr<settings.targetCtr)return {priority:0,action:'检查标题与摘要是否准确',reason:'已有展现且位置相对靠前，按本次点击率参考线筛选；仍需结合实际查询判断。'};
 return {priority:6,action:'保留并持续维护有效内容',reason:'当前未触发这些筛选规则，继续观察资料时效和读者反馈。'};
}
export function safeCsvCell(value:unknown):string {
 let text=String(value??'');if(/^[\s]*[=+\-@]/.test(text))text="'"+text;
 return '"'+text.replaceAll('"','""')+'"';
}
export function exportReviewCsv(rows:SearchObservation[],settings:ReviewSettings,scope:string):string {
 return '\uFEFF'+[['关键词','页面URL','展现','点击','计算点击率','平均位置','建议','依据','观察范围'].map(safeCsvCell).join(','),...rows.map(row=>{const recommendation=reviewRecommendation(row,settings);return [row.query,row.page,row.impressions,row.clicks,row.ctr===null?'':(row.ctr*100).toFixed(2)+'%',row.position??'',recommendation.action,recommendation.reason,scope||'未记录观察范围'].map(safeCsvCell).join(',');})].join('\r\n')+'\r\n';
}
