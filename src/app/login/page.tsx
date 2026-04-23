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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

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
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
