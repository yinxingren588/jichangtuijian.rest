import raw from './brand-editorials.json';
export interface BrandEditorial {focus:string;summary:string;analysis:string;scenario:string;caution:string;question:string;answer:string;verdict:string;comparisons:string[];comparisonReason:string;readings:string[]}
export const brandEditorials:Record<string,BrandEditorial>=raw;
