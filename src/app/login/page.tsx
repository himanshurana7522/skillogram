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
