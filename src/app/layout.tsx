import type { Metadata } from 'next'
import styles from '@/app/page.module.css'
import { AuthContextProvider } from '@/providers/auth_provider'
import DesignProvider from '@/providers/design_provider'

export const metadata: Metadata = {
  title: 'my todo',
  description: 'ToDoアプリ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja'>
      <body className={styles.body}>
        <DesignProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </DesignProvider>
      </body>
    </html>
  )
}
