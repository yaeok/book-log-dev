'use client'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useRecoilValue } from 'recoil'

import Loading from '@/components/loading.component'
import { messageState } from '@/states/message'
import { userState } from '@/states/user'
import { useToast } from '@chakra-ui/react'

type Props = {
  children: ReactNode
}

export const AuthGuard = ({ children }: Props) => {
  const user = useRecoilValue(userState)
  const message = useRecoilValue(messageState)
  const router = useRouter()
  const toast = useToast()

  if (typeof user === 'undefined') {
    return <Loading />
  }

  if (user === null) {
    router.replace('/signin')
    if (!message) {
      toast({
        title: 'ログインしてください',
        status: 'error',
        isClosable: true,
      })
    }
    return null
  }

  return <>{children}</>
}
