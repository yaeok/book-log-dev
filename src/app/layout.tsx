import type { Metadata } from 'next'
import styles from '@/app/page.module.css'
import { AuthContextProvider } from '@/providers/auth_provider'
import DesignProvider from '@/providers/design_provider'

export const metadata: Metadata = {
  title: 'b-log',
  description:
    'これまであなたが読んできた本を記録に残して、自分だけの本棚を作りましょう。',
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
