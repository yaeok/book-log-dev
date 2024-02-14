'use client'

import { onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import Loading from '@/components/loading.component'
import { getUserInfoByUid } from '@/libs/apis/firestore/user'
import { auth } from '@/libs/config'
import { messageState } from '@/states/message'
import { userState } from '@/states/user'

export const AuthContext = React.createContext({})

export const useAuthContext = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useRecoilState(userState)
  const [loading, setLoading] = React.useState(true)
  const setMessage = useSetRecoilState(messageState)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserInfoByUid({ uid: user.uid }).then((userInfo: User) => {
          setMessage(true)
          setUser({
            uid: userInfo.uid,
            username: userInfo.username,
            email: userInfo.email,
            creaedAt: userInfo.creaedAt,
            updatedAt: userInfo.updatedAt,
            deletedAt: userInfo.deletedAt,
            isActive: userInfo.isActive,
          })
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}
