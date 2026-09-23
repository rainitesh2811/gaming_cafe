'use client'

import { Homepage } from '@/components/homepage'
import { Login } from '@/components/login'
import { Signup } from '@/components/signup'
import { supabaseBrowser } from '@/lib/supabase/client'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Page() {
  const [screen, setScreen] = useState<'login' | 'signup' | 'home'>('login')
  const [isGoogleUser, setIsGoogleUser] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let active = true

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setIsGoogleUser(false)
      setScreen(session ? 'home' : 'login')
      setCheckingSession(false)
    })

    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!active) return
      setIsGoogleUser(false)
      setScreen(data.session ? 'home' : 'login')
      setCheckingSession(false)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await supabaseBrowser.auth.signOut()
    await signOut({ redirect: false })
    setIsGoogleUser(false)
    setScreen('login')
  }

  if (checkingSession) return null
  if (screen === 'home') return <Homepage onLogout={handleLogout} isGoogleUser={isGoogleUser} />
  if (screen === 'signup') return <Signup onSignup={() => { setIsGoogleUser(false); setScreen('home') }} onLogin={() => setScreen('login')} />
  return <Login onLogin={(provider) => { setIsGoogleUser(provider === 'google'); setScreen('home') }} onSignup={() => setScreen('signup')} />
}
