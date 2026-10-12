'use client';

import Link from 'next/link';
import { type FormEvent } from 'react';
import { contactServices } from '@/lib/contact';
import { site } from '@/lib/site';
import { Arrow } from './ui';

export function ContactForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `CAhead inquiry from ${data.get('name') || 'website visitor'}`;
    const body = [
      `Name: ${data.get('name') || ''}`,
      `Business email: ${data.get('email') || ''}`,
      `Company: ${data.get('company') || ''}`,
      `Website: ${data.get('website') || ''}`,
      `Service: ${data.get('service') || ''}`,
      `Monthly budget: ${data.get('budget') || 'Not specified'}`,
      '',
      String(data.get('message') || ''),
    ].join('\n');
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return <form onSubmit={submit} className="contact-form" aria-label="Growth inquiry">
    <p className="form-preview"><strong>Email inquiry.</strong> Submitting opens your email app with the details completed for you.</p>
    <div className="form-grid">
      <div className="field"><label htmlFor="name">Name *</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100}/></div>
      <div className="field"><label htmlFor="email">Business email *</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
      <div className="field"><label htmlFor="company">Company *</label><input id="company" name="company" autoComplete="organization" required maxLength={160}/></div>
      <div className="field"><label htmlFor="website">Website *</label><input id="website" name="website" type="url" autoComplete="url" placeholder="https://yourcompany.com" required maxLength={500}/></div>
      <div className="field"><label htmlFor="service">Service of interest *</label><select id="service" name="service" defaultValue="Not sure yet">{contactServices.map(service => <option key={service}>{service}</option>)}</select></div>
      <div className="field"><label htmlFor="budget">Monthly budget (optional)</label><select id="budget" name="budget" defaultValue=""><option value="">Select a range (USD)</option><option>Under $3,000</option><option>$3,000–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option><option>To be discussed</option></select></div>
      <div className="field field-wide"><label htmlFor="message">What would you like to achieve? *</label><textarea id="message" name="message" required minLength={20} maxLength={5000} placeholder="A little about your brand, your current program, and where you’d like to go."/></div>
    </div>
    <label className="form-consent"><input name="consent" type="checkbox" required/><span>I agree to be contacted about this inquiry and have read the <Link href="/privacy">Privacy Policy</Link>. No marketing subscription.</span></label>
    <button className="button" type="submit">Prepare Email <Arrow/></button>
    <p className="form-note">Your information stays in your email app until you choose to send it.</p>
  </form>;
}
