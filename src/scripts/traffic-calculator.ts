import {trafficDefaults,trafficPresets,trafficFields,estimateTraffic,directoryUrlForEstimate,trafficSummary,type TrafficInput} from '../lib/traffic-calculator';
const calculator=document.querySelector<HTMLFormElement>('#traffic-form');
if(calculator){
 const form=calculator;
 const input=(name:string)=>form.elements.namedItem(name) as HTMLInputElement;
 const quality=document.querySelector<HTMLSelectElement>('#video-quality')!;
 const error=document.querySelector<HTMLElement>('#calculator-error')!,content=document.querySelector<HTMLElement>('#calculator-result-content')!;
 const number=(value:number)=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:1}).format(value);
 let lastInput:TrafficInput|null=null;
 const read=():TrafficInput=>Object.fromEntries([...Object.keys(trafficFields),'monthlyBudget'].map(name=>[name,name==='monthlyBudget'&&input(name).value.trim()===''?null:input(name).valueAsNumber])) as unknown as TrafficInput;
 function render(){
  try{
   const values=read(),estimate=estimateTraffic(values);lastInput=values;error.hidden=true;content.hidden=false;
   for(const key of ['video','meeting','other','files','transferred','billed','reserve','recommended'] as const){
    document.querySelectorAll<HTMLElement>(`[data-traffic-value="${key}"]`).forEach(e=>e.textContent=number(estimate[key]));
   }
   for(const key of ['video','meeting','other','files'] as const){const bar=document.querySelector<HTMLElement>(`[data-traffic-bar="${key}"]`)!;bar.style.width=(estimate.transferred?estimate[key]/estimate.transferred*100:0)+'%';}
   document.querySelector('#estimate-caption')!.textContent=`${values.days}天 · ${values.people}人 · ${values.multiplier}倍规划 · 预留${values.reservePercent}%`;
   document.querySelector('#calculator-assumptions')!.textContent=`当前用${values.multiplier}倍和${values.reservePercent}%余量演算；这不是已核实的品牌扣量规则。`;
   const url=directoryUrlForEstimate(estimate,values.monthlyBudget),link=document.querySelector<HTMLAnchorElement>('#calculator-directory-link')!,hint=document.querySelector<HTMLElement>('#calculator-directory-hint')!;
   link.hidden=!url;if(url)link.href=url;
   hint.textContent=estimate.recommended===0?'当前输入没有产生用量，请增加需要估算的任务。':url?'目录将带入月付、最低额度和所填预算。匹配的是参考字段，仍需核对套餐倍率与实际结算。':'估算超过目录可筛选范围，请按任务分组核对套餐条件。';
   form.dataset.state='valid';
  }catch(e){
   lastInput=null;error.textContent=e instanceof Error?e.message:'请检查输入数值。';error.hidden=false;content.hidden=true;form.dataset.state='invalid';
  }
  document.querySelector('#calculator-copy-status')!.textContent='';
 }
 function apply(values:TrafficInput){
  for(const [key,value]of Object.entries(values))input(key).value=value===null?'':String(value);
  quality.value=[.3,.7,3,7].includes(values.videoGBPerHour)?String(values.videoGBPerHour):'custom';
  render();
 }
 form.addEventListener('submit',e=>{e.preventDefault();render();});
 form.addEventListener('input',event=>{if(event.target===input('videoGBPerHour'))quality.value='custom';render();});
 quality.addEventListener('change',()=>{if(quality.value!=='custom')input('videoGBPerHour').value=quality.value;render();});
 document.querySelectorAll<HTMLButtonElement>('[data-traffic-preset]').forEach(button=>button.addEventListener('click',()=>apply(trafficPresets[button.dataset.trafficPreset!]!)));
 document.querySelector('#calculator-reset')!.addEventListener('click',()=>apply({...trafficDefaults}));
 document.querySelector('#calculator-copy')!.addEventListener('click',async()=>{
  if(!lastInput)return;
  try{await navigator.clipboard.writeText(trafficSummary(lastInput,estimateTraffic(lastInput)));document.querySelector('#calculator-copy-status')!.textContent='已复制估算结果。';}
  catch{document.querySelector('#calculator-copy-status')!.textContent='未能自动复制，可直接选择结果文字复制。';}
 });
 document.querySelectorAll<HTMLButtonElement>('[data-calculator-control]').forEach(button=>button.disabled=false);
 render();
}
