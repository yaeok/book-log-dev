import Main from '@/components/main.component'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Main>{children}</Main>
    </div>
  )
}
