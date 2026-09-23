import { supabase } from '@/lib/supabase/server'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

export const { handlers, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: (process.env.AUTH_GOOGLE_ID ?? process.env.NEXTAUTH_GOOGLE_ID)!,
      clientSecret: (process.env.AUTH_GOOGLE_SECRET ?? process.env.NEXTAUTH_GOOGLE_SECRET)!,
    }),
    Credentials({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email : ''
        const password = typeof credentials?.password === 'string' ? credentials.password : ''
        if (!email || !password) return null

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error || !data.user) return null

        return { id: data.user.id, email: data.user.email }
      },
    }),
  ],
})