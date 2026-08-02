'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="animate-fade-in" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '40px' }}>
        <ArrowLeft size={20} /> Back to Nebula
      </Link>
      
      <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '20px', background: 'linear-gradient(to right, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Effective Date: August 2026</p>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>1. Information We Collect</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Skillogram collects information you provide directly to us when you create an account, build your profile, upload content, and interact with our platform. This includes your name, email address, profile photo, and skill tags.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>2. How We Use Information</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect Skillogram and our users.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>3. Information Sharing</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          We do not share your personal information with companies, organizations, or individuals outside of Skillogram except in the following cases: with your consent, for legal reasons, or with domain administrators.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>4. Data Security</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          We work hard to protect Skillogram and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use secure servers and encryption.
        </p>
      </section>
      
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px' }}>5. Account Deletion</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          You may request deletion of your account at any time through the Settings menu. Upon deletion, all your personal data and uploaded content will be permanently removed from our active databases.
        </p>
      </section>

      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '60px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
        © 2026 Skillogram Inc. All rights reserved.
      </p>
    </div>
  );
}
