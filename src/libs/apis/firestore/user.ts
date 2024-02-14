import { doc, onSnapshot } from 'firebase/firestore'

import { db } from '@/libs/config'

/**
 * ユーザIdからユーザ情報取得処理
 * @param args uid
 * @returns
 */
export const getUserInfoByUid = async (args: { uid: string }) => {
  const docRef = doc(db, 'users', args.uid)
  return new Promise<User>((resolve, reject) => {
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data()
          const user: User = {
            uid: userData.uid,
            username: userData.name,
            email: userData.email,
            creaedAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            deletedAt: userData.deletedAt,
            isActive: userData.isActive,
          }

          resolve(user)
        }
      },
      (error) => {
        reject(error)
      }
    )

    // 監視の解除を行う関数を返す
    return () => {
      unsubscribe()
    }
  })
}
