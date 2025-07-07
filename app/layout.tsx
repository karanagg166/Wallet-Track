import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'WalletTrack',
  description: 'Track your expenses with ease.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full w-full">
      <body className="h-full w-full bg-gray-50">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen w-full flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
