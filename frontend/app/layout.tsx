import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const playFairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Forestfy',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playFairDisplay.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
