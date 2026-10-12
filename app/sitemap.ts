import type { MetadataRoute } from 'next';
import { site,services } from '@/lib/site';
import { articles } from '@/lib/articles';
export default function sitemap():MetadataRoute.Sitemap {if(!site.launchReady)return [];return ['', '/about','/services',...services.map(s=>`/services/${s.slug}`),'/case-studies','/insights',...articles.map(a=>`/insights/${a.slug}`),'/contact','/privacy','/terms'].map(path=>({url:`${site.url}${path}`,changeFrequency:path.startsWith('/insights')?'monthly':'yearly',priority:path===''?1:.7}));}
