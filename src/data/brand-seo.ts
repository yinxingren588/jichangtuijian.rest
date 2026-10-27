import raw from './brand-seo.json';
import {airports,type Airport} from './airports';
import {renderBrandFacts} from '../lib/brand-facts';

export interface BrandSeo {title:string;heading:string;description:string;keywords:string[]}
// Prose remains independently editable; factual tokens resolve from the plan catalogue.
export const brandSeoTemplates:Record<string,BrandSeo>=raw;
export function resolveBrandSeo(brand:Airport,template:BrandSeo=brandSeoTemplates[brand.slug]):BrandSeo {
 if(!template)throw new Error('Missing brand SEO template: '+brand.slug);
 const resolve=(value:string)=>renderBrandFacts(value,brand);
 return {title:resolve(template.title),heading:resolve(template.heading),description:resolve(template.description),keywords:[...new Set(template.keywords.map(resolve).filter(Boolean))]};
}
export const brandSeo:Record<string,BrandSeo>=Object.fromEntries(airports.map(brand=>[brand.slug,resolveBrandSeo(brand)]));
export const brandSeoUpdated='2026-10-27';
