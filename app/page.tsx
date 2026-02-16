'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

type Bookmark = {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: s } = await supabase.auth.getSession()
      const u = s?.session?.user ?? null
      if (!u) {
        router.replace('/login')
        return
      }
      setUser(u)
      setAuthChecked(true)
      await loadBookmarks()
    }
    init()
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.replace('/login')
      } else {
        setUser(session.user)
        setAuthChecked(true)
        loadBookmarks()
      }
    })
    return () => sub?.subscription?.unsubscribe?.()
  }, [router])

  const loadBookmarks = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false })
    if (!error && data) setBookmarks(data as Bookmark[])
    setLoading(false)
  }

  const addBookmark = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!title.trim() || !url.trim()) return
    
    setLoading(true)
    
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id
    
    if (!userId) {
      alert('Not authenticated. Please log in again.')
      setLoading(false)
      return
    }
    
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ 
        title: title.trim(), 
        url: url.trim(),
        user_id: userId
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding bookmark:', error)
      alert(`Error: ${error.message}`)
    }
    
    if (!error && data) {
      setBookmarks(prev => [data as Bookmark, ...prev])
      setTitle('')
      setUrl('')
    }
    
    setLoading(false)
  }

  const removeBookmark = async (id: string) => {
    setLoading(true)
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (!error) setBookmarks(prev => prev.filter(b => b.id !== id))
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (!authChecked) {
    return null
  }

  return (
    <div className="dashboard-root">
      <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="sidebar-card">
        <div className="brand-row">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-5-7 5V4Z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <div>
            <div className="h1">Marktrabit</div>
            <div className="kicker">Organize, discover, remember</div>
          </div>
        </div>

        <div className="user-section">
          <div className="user-info">
            <div className="kicker">Signed in</div>
            <div className="kicker user-email">{user?.email ?? '—'}</div>
          </div>
          <button className="signout-btn" onClick={signOut}>Sign out</button>
        </div>

        <form onSubmit={addBookmark} className="bookmark-form">
          <div className="form-row">
            <label className="label">Title</label>
            <input className="input" placeholder="Enter bookmark title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-row">
            <label className="label">URL</label>
            <input className="input-url" placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div className="button-group">
            <button className="add-btn" disabled={loading} type="submit">+ Add Bookmark</button>
            <button type="button" className="ghost" onClick={() => { setTitle(''); setUrl('') }}>Clear</button>
          </div>
        </form>

        <div className="tips-section">
          <div className="kicker">Tips</div>
          <div className="empty">Paste a full URL and a short title. Use the search bar to find later.</div>
        </div>
      </motion.aside>

      <main className="content-area">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card">
          <div className="header-section">
            <div>
              <div className="section-title">Your Bookmarks</div>
              <div className="kicker section-subtitle">{bookmarks.length} total</div>
            </div>
            <div className="stats-row">
              <div className="stat">
                <div className="num">{bookmarks.length}</div>
                <div className="label">Bookmarks</div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="bookmarks-grid">
            {loading && <div className="card empty">Loading...</div>}
            {!loading && bookmarks.length === 0 && <div className="card empty">No bookmarks yet. Add your first one above.</div>}
            {!loading && bookmarks.map(b => (
              <motion.div key={b.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="bookmark-card">
                <div className="favicon">{b.title?.charAt(0).toUpperCase() ?? 'B'}</div>
                <div className="bookmark-meta">
                  <div className="bookmark-title">{b.title}</div>
                  <div className="bookmark-url">{b.url}</div>
                </div>
                <div className="bookmark-actions">
                  <a className="ghost" href={b.url} target="_blank" rel="noreferrer">Open</a>
                  <button className="ghost" onClick={() => removeBookmark(b.id)}>Delete</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}