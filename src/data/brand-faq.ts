import raw from './brand-faq.json';
import extras from './brand-faq-extra.json';
import type {FaqItem} from '../lib/faq';
import {type Airport} from './airports';
import {brandEditorials} from './brand-editorials';
import {renderBrandFacts} from '../lib/brand-facts';
export type BrandQuestion=FaqItem;
export const brandFaqTemplates:Record<string,BrandQuestion[]>=Object.fromEntries(Object.entries(raw).map(([slug,items])=>{const more=(extras as Record<string,BrandQuestion[]>)[slug];if(!more)throw Error('Missing brand FAQ additions '+slug);return [slug,[...items,...more]];}));
export function questionsForBrand(brand:Airport):BrandQuestion[]{
 const original=brandEditorials[brand.slug];
 const added=brandFaqTemplates[brand.slug];
 if(!original||!added)throw new Error('Missing brand FAQ: '+brand.slug);
 return [{question:original.question,answer:original.answer},...added].map(q=>({...q,question:renderBrandFacts(q.question,brand),answer:renderBrandFacts(q.answer,brand)}));
}
