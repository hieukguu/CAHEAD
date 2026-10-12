'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { contactServices } from '@/lib/contact';
import { Arrow } from './ui';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjygozwq';

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const alert = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus(null);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('submission-failed');
      setStatus({ ok: true, message: 'Thank you. Your message has been sent successfully. We’ll be in touch soon.' });
      form.current?.reset();
    } catch {
      setStatus({ ok: false, message: 'We could not send your message. Please try again or email info@caheadagency.com.' });
    } finally {
      setBusy(false);
      requestAnimationFrame(() => alert.current?.focus());
    }
  }

  return <form ref={form} onSubmit={submit} action={FORMSPREE_ENDPOINT} method="POST" className="contact-form" aria-label="Growth inquiry" aria-busy={busy}>
    <input type="hidden" name="_subject" value="New CAhead website inquiry"/>
    <input type="text" name="_gotcha" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    {status && <div ref={alert} tabIndex={-1} role={status.ok ? 'status' : 'alert'} className={`form-alert ${status.ok ? 'form-success' : ''}`}>{status.message}</div>}
    <div className="form-grid">
      <div className="field"><label htmlFor="name">Name *</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100}/></div>
      <div className="field"><label htmlFor="email">Business email *</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
      <div className="field"><label htmlFor="company">Company *</label><input id="company" name="company" autoComplete="organization" required maxLength={160}/></div>
      <div className="field"><label htmlFor="website">Website *</label><input id="website" name="website" type="url" autoComplete="url" placeholder="https://yourcompany.com" required maxLength={500}/></div>
      <div className="field"><label htmlFor="service">Service of interest *</label><select id="service" name="service" defaultValue="Not sure yet">{contactServices.map(service => <option key={service}>{service}</option>)}</select></div>
      <div className="field"><label htmlFor="budget">Monthly budget (optional)</label><select id="budget" name="budget" defaultValue=""><option value="">Select a range (USD)</option><option>Under $3,000</option><option>$3,000–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option><option>To be discussed</option></select></div>
      <div className="field field-wide"><label htmlFor="message">What would you like to achieve? *</label><textarea id="message" name="message" required minLength={20} maxLength={5000} placeholder="A little about your brand, your current program, and where you’d like to go."/></div>
    </div>
    <label className="form-consent"><input name="consent" type="checkbox" value="Agreed" required/><span>I agree to be contacted about this inquiry and have read the <Link href="/privacy">Privacy Policy</Link>. No marketing subscription.</span></label>
    <button className="button" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send Inquiry'} <Arrow/></button>
    <p className="form-note">Your inquiry is securely delivered through Formspree. No marketing subscription.</p>
  </form>;
}
