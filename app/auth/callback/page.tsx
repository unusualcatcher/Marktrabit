'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
// app/auth/ca;;nac
export default function AuthCallback() {
  const router = useRouter()
  useEffect(() => {
    // supabase handles finishing the OAuth flow; once session exists, go home
    supabase.auth.getSession().then(() => {
      router.replace('/')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div className="p-6">Signing you in…</div>
}