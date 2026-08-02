'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="animate-fade-in" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '40px' }}>
        <ArrowLeft size={20} /> Back to Nebula
      </Link>
      
      <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '20px', background: 'linear-gradient(to right, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Effective Date: August 2026</p>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>1. Acceptance of Terms</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          By accessing or using Skillogram, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>2. User Conduct</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          You agree not to use Skillogram to post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable. We reserve the right to remove any content and suspend or terminate accounts that violate these terms.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>3. Intellectual Property</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          The service and its original content, features, and functionality are owned by Skillogram and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>4. Content Ownership</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          You retain all of your ownership rights in your content, but you are required to grant us a limited license to use, store, and copy that content and to distribute and make it available to third parties.
        </p>
      </section>

      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '60px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
        © 2026 Skillogram Inc. All rights reserved.
      </p>
    </div>
  );
}
