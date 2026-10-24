import raw from './brand-seo.json';

export interface BrandSeo {title:string;heading:string;description:string;keywords:string[]}
// Each record is editable independently; the shared layout only adds the site name.
export const brandSeo:Record<string,BrandSeo>=raw;
export const brandSeoUpdated='2026-10-24';
