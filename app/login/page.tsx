'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: s } = await supabase.auth.getSession()
      if (s?.session?.user) {
        router.replace('/')
        return
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [router])

  const handleLogin = async () => {
    try {
      setLoading(true)
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/auth/callback` },
      })
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked) {
    return null
  }

  return (
    <div className="login-root">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="auth-card"
      >
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="auth-header"
        >
          <div className="brand-icon" aria-hidden>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-5-7 5V4Z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>

          <h1 className="auth-title">Marktrabit</h1>
          <p className="auth-sub">Your intelligent bookmark manager</p>
        </motion.div>

        <motion.button
          whileHover={{ translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={loading}
          className="google-btn"
          aria-label="Continue with Google"
        >
          <span className="g-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path d="M533.5 278.4c0-17.7-1.6-35.3-4.8-52.3H272v98.9h146.9c-6.3 34.1-25 62.9-53.4 82.1v68.2h86.1c50.3-46.4 79.9-114.5 79.9-196.9z" fill="#4285F4"/>
              <path d="M272 544.3c72.6 0 133.7-24 178.2-65.1l-86.1-68.2c-24 16.2-54.6 25.8-92.1 25.8-70.7 0-130.6-47.7-152-111.7H33.5v70.3C77.6 490 166.5 544.3 272 544.3z" fill="#34A853"/>
              <path d="M120 323.1c-10.9-32.9-10.9-68.7 0-101.6V151.2H33.5C12 197.8 0 241.8 0 272.5s12 74.7 33.5 121.3L120 323.1z" fill="#FBBC05"/>
              <path d="M272 107.7c39.5 0 75.1 13.6 103 40.3l77-77C405.5 24 344.8 0 272 0 166.5 0 77.6 54.3 33.5 151.2l86.5 70.3C141.4 155.4 201.3 107.7 272 107.7z" fill="#EA4335"/>
            </svg>
          </span>
          <span className="g-text">Continue with Google</span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="legal"
        >
          By continuing, you agree to our{' '}
          <a href="#" className="link">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="link">Privacy Policy</a>
        </motion.p>
      </motion.div>
    </div>
  )
}