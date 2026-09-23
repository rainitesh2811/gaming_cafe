'use client'

import { Eye, EyeOff, Gamepad2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

function Brand() {
  return (
    <div className="brand-mark" aria-label="LevelUp home">
      <span className="brand-icon"><Gamepad2 size={18} strokeWidth={2.5} /></span>
      <span>LEVEL<span>UP</span></span>
    </div>
  )
}

type SignupProps = {
  onSignup: () => void
  onLogin: () => void
}

export function Signup({ onSignup, onLogin }: SignupProps) {
  const [showPassword, setShowPassword] = useState(false)

  async function handleGoogleSignIn() {
    const result = await signIn('google', { callbackUrl: '/', redirect: false })
    if (result?.ok) onSignup()
  }

  return (
    <main className="auth-shell">
      <section className="auth-art" aria-label="Gaming illustration">
        <div className="art-glow" />
        <Brand />
        <div className="art-copy">
          <p className="eyebrow">YOUR NEXT SESSION AWAITS</p>
          <h1>Level up<br /><span>your experience.</span></h1>
          <p>Find your squad. Claim your seat.<br />Play without limits.</p>
        </div>
        <img src="/gaming-hero.png" alt="Neon gaming setup illustration" />
        <div className="art-stat"><strong>24/7</strong><span>Gaming<br />access</span></div>
      </section>

      <section className="auth-panel">
        <div className="auth-header">
          <p className="mobile-brand"><Brand /></p>
          <p className="eyebrow">WELCOME, PLAYER</p>
          <h2>Join the squad.</h2>
          <p className="muted">Create an account and start your adventure.</p>
        </div>
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button role="tab" aria-selected="false" onClick={onLogin}>Log In</button>
          <button className="active" role="tab" aria-selected="true">Sign Up</button>
        </div>
        <form className="auth-form" onSubmit={(event) => { event.preventDefault(); onSignup() }}>
          <label>Email or Username<input type="text" placeholder="you@example.com" required /></label>
          <label>Password<div className="password-input"><input type={showPassword ? 'text' : 'password'} placeholder="Create a password" required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <button className="primary-button" type="submit">Create Account<span>→</span></button>
        </form>
        <div className="divider"><span>or continue with</span></div>
        <div className="social-row">
          <button type="button" aria-label="Continue with Google" className="social google" onClick={handleGoogleSignIn}>G</button>
          <button aria-label="Continue with Discord" className="social discord">◌</button>
          <button aria-label="Continue with Steam" className="social steam"><Gamepad2 size={18} /></button>
        </div>
        <p className="terms">By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </section>
    </main>
  )
}