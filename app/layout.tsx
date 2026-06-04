import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/config'
import './globals.css'

export const metadata: Metadata = {
  title: SITE_CONFIG.pageTitle,
  description: SITE_CONFIG.metaDescription,
  openGraph: {
    title: SITE_CONFIG.pageTitle,
    description: SITE_CONFIG.metaDescription,
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-brand-dark text-white antialiased">{children}</body>
    </html>
  )
}
