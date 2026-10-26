import raw from './brand-fact-history.json';
import type {Airport} from './airports';
import {assertHistoryCurrent,type BrandHistory} from '../lib/brand-history';

export const brandFactHistory=raw as BrandHistory;
export function historyForBrand(brand:Airport) {
 const events=brandFactHistory[brand.slug]??[];
 assertHistoryCurrent(brand,events);
 return [...events].sort((a,b)=>b.date.localeCompare(a.date));
}
