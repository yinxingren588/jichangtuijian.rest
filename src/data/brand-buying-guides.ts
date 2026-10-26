import raw from './brand-buying-guides.json';
import type {Airport} from './airports';
import {renderBrandFacts} from '../lib/brand-facts';

export interface BrandBuyingGuide {headline:string;summary:string;forWhom:string;notFor:string;choice:string;advantage:string;tradeoff:string;evidenceFocus:string}
export const buyingGuideUpdated='2026-10-26';
export const brandBuyingGuides:Record<string,BrandBuyingGuide>=raw;
export function buyingGuideFor(brand:Airport):BrandBuyingGuide {
 const template=brandBuyingGuides[brand.slug];
 if(!template)throw Error('Missing buying guide: '+brand.slug);
 return Object.fromEntries(Object.entries(template).map(([key,text])=>[key,renderBrandFacts(text,brand)])) as unknown as BrandBuyingGuide;
}
