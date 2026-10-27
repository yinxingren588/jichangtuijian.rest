import type {Plan} from '../data/airports';
export interface QuotaChoice {required:number;eligible:number[];unknown:number[]}
export function chooseMonthlyQuota(plans:Plan[],billedGB:number,reservePercent:number):QuotaChoice {
 if(!Number.isFinite(billedGB)||billedGB<0||billedGB>1_000_000||!Number.isFinite(reservePercent)||reservePercent<0||reservePercent>100)throw Error('用量应为0–1000000GB，余量比例应为0–100%。');
 const required=Math.ceil(billedGB*(1+reservePercent/100));
 return {required,eligible:plans.flatMap((p,i)=>p.period==='month'&&p.trafficPeriod==='month'&&p.trafficGB!==undefined&&p.trafficGB>=required?[i]:[]),unknown:plans.flatMap((p,i)=>p.trafficGB===undefined||p.trafficPeriod!=='month'?[i]:[])};
}
export function compareRecurringAndOneTime(monthly:Plan,once:Plan,months:number,billedGBPerMonth:number) {
 if(!Number.isInteger(months)||months<1||months>36||!Number.isFinite(billedGBPerMonth)||billedGBPerMonth<0||billedGBPerMonth>1_000_000)throw Error('月份应为1–36之间的整数，月度计费用量应为0–1000000GB。');
 if(monthly.period!=='month'||monthly.trafficPeriod!=='month'||once.period!=='one-time'||once.trafficPeriod!=='one-time'||monthly.currency!==once.currency||monthly.priceKind==='monthly-equivalent'||once.priceKind==='monthly-equivalent')throw Error('此演算仅适用于同币种月付与一次性总量，不混入年付折算。');
 return {months,billedGBPerMonth,totalGB:months*billedGBPerMonth,monthlyCost:Number((months*monthly.price).toFixed(2)),monthlyFits:monthly.trafficGB===undefined?null:billedGBPerMonth<=monthly.trafficGB,onceCost:once.price,onceFits:once.trafficGB===undefined?null:months*billedGBPerMonth<=once.trafficGB};
}
export function videoBudget(hoursPerDay:number,averageMbps:number,days:number,filesGB:number,multiplier:number,reservePercent:number) {
 const values=[hoursPerDay,averageMbps,days,filesGB,multiplier,reservePercent];
 if(values.some(v=>!Number.isFinite(v))||hoursPerDay<0||hoursPerDay>24||averageMbps<=0||averageMbps>100||!Number.isInteger(days)||days<1||days>31||filesGB<0||filesGB>1_000_000||multiplier<.1||multiplier>10||reservePercent<0||reservePercent>100)throw Error('请检查小时、速率、天数、文件量、倍率及余量的范围。');
 const videoGB=hoursPerDay*averageMbps*.45*days;
 const billedGB=(videoGB+filesGB)*multiplier;
 return {videoGB,billedGB,required:Math.ceil(billedGB*(1+reservePercent/100))};
}
