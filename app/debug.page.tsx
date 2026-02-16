// app/debug_page.tsx
export default function Debug() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Marktrabit debug</h1>
      <pre>
        {JSON.stringify(
          {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY_exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
          null,
          2
        )}
      </pre>
    </main>
  )
}
