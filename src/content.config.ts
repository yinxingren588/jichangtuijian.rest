import {defineCollection} from 'astro:content';
import {z} from 'astro/zod';
import {glob} from 'astro/loaders';
const articles=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/articles'}),schema:z.object({title:z.string(),description:z.string(),section:z.enum(['guides','blog','glossary']),published:z.string(),updated:z.string(),tags:z.array(z.string()),category:z.string().optional(),related:z.array(z.string()).optional(),sources:z.array(z.url()).min(1),draft:z.boolean().default(false)})});
const reviews=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/reviews'}),schema:z.object({title:z.string(),description:z.string(),airportSlug:z.string(),conclusion:z.string(),published:z.string(),updated:z.string(),sources:z.array(z.url()).min(1),evidenceFile:z.string(),draft:z.boolean().default(true)})});
export const collections={articles,reviews};
