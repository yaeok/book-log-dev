'use client'
import { Flex, Spinner } from '@/design'

export default function Loading() {
  return (
    <Flex h='100vh' justifyContent='center' alignItems='center'>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='purple.500'
        size='xl'
      />
    </Flex>
  )
}
