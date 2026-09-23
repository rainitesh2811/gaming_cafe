'use client'

import { Homepage } from '@/components/homepage'
import { Login } from '@/components/login'
import { Signup } from '@/components/signup'
import { useState } from 'react'

export default function Page() {
  const [screen, setScreen] = useState<'login' | 'signup' | 'home'>('login')

  if (screen === 'home') return <Homepage />
  if (screen === 'signup') return <Signup onSignup={() => setScreen('home')} onLogin={() => setScreen('login')} />
  return <Login onLogin={() => setScreen('home')} onSignup={() => setScreen('signup')} />
}
