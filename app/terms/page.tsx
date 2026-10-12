import { site } from '@/lib/site';

export const metadata = { title: 'Terms of Use', description: 'Website terms and service-scope disclosures for CAhead.', alternates: { canonical: '/terms' } };

export default function Terms() {
  return <article className="container legal">
    <p className="eyebrow">WEBSITE INFORMATION</p><h1>Terms of Use</h1><p>Last updated · October 12, 2026</p>
    <h2>About this website</h2><p>CAhead is operated by {site.legalName}, located at {site.address.streetAddress}, {site.address.addressLocality}, {site.address.addressRegion} {site.address.postalCode}, {site.address.addressCountry}. The site describes our service offering. It does not establish a contract for services, a partnership, or a guarantee of availability.</p>
    <h2>Engagements and service availability</h2><p>Any work requires a separate written agreement defining the scope, delivery team, fees, responsibilities, timing, and termination terms. Paid media, creative production, platform costs, and specialist work are included only when explicitly agreed.</p>
    <h2>Information and illustrative content</h2><p>Articles provide general educational information. They are not individualized legal, financial, or commercial advice. Sample engagement briefs are hypothetical planning examples; they are not client case studies and contain no measured outcomes.</p>
    <h2>Performance and third-party platforms</h2><p>No revenue, ranking, placement, conversion, or return-on-investment outcome is guaranteed. Platform rules, publisher decisions, market conditions, and your business operations can affect results. References to partner types or platforms do not imply certification or an official relationship.</p>
    <h2>Intellectual property</h2><p>The site’s original text, visual design, and illustrations belong to {site.legalName} or its licensors. Third-party names and trademarks remain the property of their respective owners.</p>
    <h2>Acceptable use</h2><p>Do not use the contact form to submit unlawful content, malicious code, impersonations, spam, passwords, or confidential third-party data. Do not attempt to disrupt the site or bypass its security controls.</p>
    <h2>Links and availability</h2><p>External resources may change or become unavailable. We may update, suspend, or withdraw site content without notice. Applicable mandatory consumer and business rights are not excluded.</p>
    <h2>Governing law and contact</h2><p>These terms are governed by the laws applicable to {site.legalName} in Colorado, United States, subject to any mandatory rights that apply to you. Questions may be sent to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
  </article>;
}
