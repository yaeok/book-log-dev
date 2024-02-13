'use client'
import { ReactNode } from 'react'

import { Container } from '@/design'

export default function Main({ children }: { children: ReactNode }) {
  return (
    <Container
      as='main'
      maxW={{ lg: 'container.lg', md: 'container.md', sm: 'container.sm' }}
      minH='100vh'
    >
      {children}
    </Container>
  )
}
