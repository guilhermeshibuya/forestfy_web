import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/query-provider'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

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
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
