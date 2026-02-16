import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Marktrabit',
  description: 'Your intelligent bookmark manager',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="%236b46ff"/><stop offset="1" stop-color="%234f46e5"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="url(%23g)"/><path d="M27 22a6 6 0 0 1 6-6h34a6 6 0 0 1 6 6v62l-23-17-23 17V22Z" fill="white" fill-opacity="0.95"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}