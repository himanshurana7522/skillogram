'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        action: isLogin ? 'login' : 'signup'
      });

      if (res?.error) {
        setError(res.error);
        alert(`Auth Failed: ${res.error}`);
      } else {
        if (!isLogin) {
          setSuccess("Account created! You are now logged in.");
          alert("Success! Account created. You are now logged in.");
        } else {
          alert("Login successful! Redirecting...");
        }
        router.push('/');
      }
    } catch (err: unknown) {
      console.error("[CRASH]:", err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`A system error occurred: ${msg}`);
      setError(`An unexpected error occurred: ${msg}`);
    } finally {
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

        <div style={{ margin: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', position: 'relative' }}>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#09090b', padding: '0 10px' }}>or</span>
        </div>

        <button 
          className="btn-auth" 
          style={{ background: 'white', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} 
          onClick={() => signIn('google')}
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Continue with Google
        </button>

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
