'use client'

import { Homepage } from '@/components/homepage'
import { Login } from '@/components/login'
import { Signup } from '@/components/signup'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Page() {
  const [screen, setScreen] = useState<'login' | 'signup' | 'home'>('login')

  async function handleLogout() {
    await signOut({ redirect: false })
    setScreen('login')
  }

  if (screen === 'home') return <Homepage onLogout={handleLogout} />
  if (screen === 'signup') return <Signup onSignup={() => setScreen('home')} onLogin={() => setScreen('login')} />
  return <Login onLogin={() => setScreen('home')} onSignup={() => setScreen('signup')} />
}
