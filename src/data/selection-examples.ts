import {partnerAirports,type Airport,type Plan} from './airports';
export const calculatorPath='/tools/traffic-calculator/';
export interface PlanExample {brand:Airport;plan:Plan}
export const lowMonthlyExamples:PlanExample[]=partnerAirports.flatMap(brand=>brand.plans.filter(plan=>plan.currency==='CNY'&&plan.period==='month'&&plan.priceKind!=='monthly-equivalent'&&plan.price<=10).map(plan=>({brand,plan}))).sort((a,b)=>a.plan.price-b.plan.price);
export function exampleBrand(slug:string):Airport {const brand=partnerAirports.find(b=>b.slug===slug);if(!brand)throw Error('Missing selection example '+slug);return brand;}
export const monthlyExample=exampleBrand('yinxingren');
export const annualExample=exampleBrand('edgenova');
export const onceExample=exampleBrand('feiv');
