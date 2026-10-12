import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
export default function robots():MetadataRoute.Robots {return site.launchReady ? {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:`${site.url}/sitemap.xml`} : {rules:{userAgent:'*',disallow:'/'}};}
