import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PrivacyControls } from '@/components/privacy-controls';
import { MotionEffects } from '@/components/motion-effects';
import { site } from '@/lib/site';
import './globals.css';
export const metadata: Metadata = { metadataBase: new URL(site.url), title: { default: 'CAhead | Affiliate & Performance Marketing', template: '%s | CAhead' }, description: 'A considered approach to affiliate program management, publisher partnerships, and measurable brand growth.', robots: { index: site.launchReady, follow: site.launchReady }, verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined }, twitter: { card: 'summary_large_image' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /><PrivacyControls /><MotionEffects /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: site.name, legalName: site.legalName, url: site.url, email: site.email, description: site.descriptor, logo: `${site.url}/cahead-logo.png`, address: { '@type': 'PostalAddress', ...site.address } }).replace(/</g, '\\u003c') }} /></body></html>; }
