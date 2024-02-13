'use client'

import { ReactNode } from 'react'
import { RecoilRoot } from 'recoil'

import { ChakraProvider } from '@chakra-ui/react'

export default function DesignProvider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </ChakraProvider>
  )
}
