import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata = { title: 'Privacy Policy', description: 'How CAhead handles inquiries and optional analytics.', alternates: { canonical: '/privacy' } };

export default function Privacy() {
  return <article className="container legal">
    <p className="eyebrow">WEBSITE INFORMATION</p><h1>Privacy Policy</h1><p>Last updated · October 12, 2026</p>
    <h2>Who controls your information</h2><p>{site.legalName}, operating as CAhead, is responsible for information submitted through this website. Our address is {site.address.streetAddress}, {site.address.addressLocality}, {site.address.addressRegion} {site.address.postalCode}, {site.address.addressCountry}. Privacy questions may be sent to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    <h2>Information provided through the contact form</h2><p>The form requests your name, business email, company, website, service of interest, optional budget, and message. It also records your agreement to be contacted about that inquiry. Do not include sensitive personal information or account credentials.</p>
    <h2>How an inquiry is handled</h2><p>The contact form sends the information you provide to our business mailbox through Formspree. We use it to assess and respond to your request and discuss potential services. We do not add you to a marketing list or sell inquiry information.</p>
    <h2>Security</h2><p>Formspree processes form submissions on our behalf and may maintain security and delivery logs. Do not include passwords, account credentials, sensitive personal information, or confidential third-party data in your message.</p>
    <h2>Cookies and analytics</h2><p>Optional Google Analytics or Google Tag Manager loads only after you choose to allow analytics. Neither is enabled until its identifier is configured. A privacy preference is stored in your browser’s local storage. Use Cookie settings in the footer to change your choice.</p>
    <h2>Retention and your choices</h2><p>Inquiries sent by email are retained only as long as needed to respond, manage a potential business relationship, meet legal obligations, or resolve disputes. Depending on the laws applicable to you, you may request access, correction, deletion, restriction, or objection by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    <h2>International processing</h2><p>Service providers may process information in the United States or other countries where they operate, subject to their safeguards and applicable law.</p>
    <h2>Contact and changes</h2><p>We may update this notice when our practices or providers change. Material revisions will be reflected by the date shown above.</p><p><Link className="text-link" href="/contact">Return to the contact page →</Link></p>
  </article>;
}
