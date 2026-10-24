import raw from './brand-faq.json';
import {type Airport} from './airports';
import {brandEditorials} from './brand-editorials';
import {renderBrandFacts} from '../lib/brand-facts';
export interface BrandQuestion {question:string;answer:string}
export const brandFaqTemplates:Record<string,BrandQuestion[]>=raw;
export function questionsForBrand(brand:Airport):BrandQuestion[]{
 const original=brandEditorials[brand.slug];
 const added=brandFaqTemplates[brand.slug];
 if(!original||!added)throw new Error('Missing brand FAQ: '+brand.slug);
 return [{question:original.question,answer:original.answer},...added].map(q=>({question:renderBrandFacts(q.question,brand),answer:renderBrandFacts(q.answer,brand)}));
}
