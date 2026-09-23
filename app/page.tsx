'use client'

import { Homepage } from '@/components/homepage'
import { Login } from '@/components/login'
import { Signup } from '@/components/signup'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Page() {
  const [screen, setScreen] = useState<'login' | 'signup' | 'home'>('login')
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  async function handleLogout() {
    await signOut({ redirect: false })
    setIsGoogleUser(false)
    setScreen('login')
  }

  if (screen === 'home') return <Homepage onLogout={handleLogout} isGoogleUser={isGoogleUser} />
  if (screen === 'signup') return <Signup onSignup={() => { setIsGoogleUser(false); setScreen('home') }} onLogin={() => setScreen('login')} />
  return <Login onLogin={(provider) => { setIsGoogleUser(provider === 'google'); setScreen('home') }} onSignup={() => setScreen('signup')} />
}
