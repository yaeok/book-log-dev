'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import { userState } from '@/states/user'

const Nav = () => {
  const user = useRecoilValue(userState)
  const router = useRouter()
  useEffect(() => {
    if (user) {
      router.replace('/books')
    } else {
      router.replace('/signin')
    }
  }, [])

  return null
}

export default Nav
