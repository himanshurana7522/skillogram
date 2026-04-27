'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './login.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [pingStatus, setPingStatus] = useState<string>('Testing connection...');

  React.useEffect(() => {
    async function testConnection() {
      let raw = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const cleanUrl = raw.replace(/['"]+/g, '').trim().replace(/\/$/, '').replace('https://https://', 'https://');
      
      if (!cleanUrl) {
        setPingStatus("❌ URL Missing");
        return;
      }
      try {
        const start = Date.now();
        const res = await fetch(`${cleanUrl}/auth/v1/health`);
        const duration = Date.now() - start;
        if (res.ok || res.status === 401) {
          setPingStatus(`🟢 LATENCY: ${duration}ms (Signal Locked)`);
        } else {
          setPingStatus(`🟠 STATUS: ${res.status}`);
        }
      } catch (err: any) {
        setPingStatus(`🔴 NETWORK ERROR: ${err.message}`);
      }
    }
    testConnection();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log(`[AUTH] Attempting ${isLogin ? 'Login' : 'Signup'} for:`, email);
      const { data, error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        console.error("[AUTH ERROR]:", error);
        // Provide more context in the alert
        alert(`Auth Failed: ${error.message} (${error.status || 'unknown status'})`);
        setError(error.message);
      } else {
        console.log("[AUTH SUCCESS]:", data);
        if (!isLogin) {
          const isEmailConfirmed = data.user?.email_confirmed_at;
          if (isEmailConfirmed) {
            alert("Success! Account created. You are now logged in.");
            setSuccess("Account created! You can now sign in.");
          } else {
            alert("Success! Account created. If login fails, check your email or verify if confirmation is required.");
            setSuccess("Account created! Check your email if required.");
          }
          setIsLogin(true);
        } else {
          alert("Login successful! Redirecting...");
        }
      }
    } catch (err: any) {
      console.error("[CRASH]:", err);
      alert(`A system error occurred: ${err.message}`);
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="nebula-blob" style={{ top: '-10%', right: '-10%' }} />
      <div className="nebula-blob" style={{ bottom: '-10%', left: '-10%', background: 'var(--accent-secondary)' }} />
      
      <div className="login-card glass-pane animate-fade-in">
        <h1 className="login-logo text-gradient">Skillogram<span>.</span></h1>
        <p>{isLogin ? 'Welcome back to the Nebula.' : 'Join the orbital skill network.'}</p>
        

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}
        
        <form className="auth-form" onSubmit={handleAuth}>
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input-field" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            required 
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button className="btn-auth" type="submit" disabled={isLoading}>
            {isLoading ? 'SYNCING...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
          </button>
        </form>
        

        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already a member?"}
          <button 
            style={{ display: 'block', margin: '15px auto', fontSize: '15px' }} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create new account' : 'Log in instead'}
          </button>
        </div>
      </div>
    </div>
  );
}
