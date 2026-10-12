'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Arrow, Logo } from './ui';
import { nav } from '@/lib/site';
export function Header() {
  const [open, setOpen] = useState(false); const path = usePathname(); const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { function escape(e: KeyboardEvent) { if(e.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); } } document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape); }, [open]);
  return <header className="site-header"><div className="container nav-wrap"><Logo /><nav aria-label="Main navigation" className="desktop-nav">{nav.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? 'page' : undefined}>{item.label}</Link>)}</nav><Link href="/contact" className="nav-cta">Let’s Talk Growth <Arrow diagonal /></Link><button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><span>{open ? 'Close' : 'Menu'}</span><span aria-hidden="true">{open ? '×' : '☰'}</span></button></div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{nav.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}<Arrow /></Link>)}<Link href="/contact" onClick={() => setOpen(false)}>Let’s Talk Growth<Arrow /></Link></nav>}</header>;
}
