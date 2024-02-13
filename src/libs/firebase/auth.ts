import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

import { auth, db } from '@/libs/config'
import { FirebaseResult } from '@/models/firebase_result'

/** firebaseのエラー */
type FirebaseError = {
  code: string
  message: string
  name: string
}

const isFirebaseError = (e: Error): e is FirebaseError => {
  return 'code' in e && 'message' in e
}
/**
 * EmailとPasswordでサインイン
 * @param email
 * @param password
 * @returns Promise<FirebaseResult>
 */
export const signInWithEmail = async (args: {
  email: string
  password: string
}): Promise<FirebaseResult> => {
  let result: FirebaseResult = { isSuccess: false, message: '' }
  try {
    const signInUser = await signInWithEmailAndPassword(
      auth,
      args.email,
      args.password
    )
    const user = signInUser.user
    const docRef = doc(db, 'users', user.uid)

    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
    } else {
      await setDoc(docRef, {
        // ユーザが存在しない場合は作成
        uid: user.uid,
        username: user.email?.substring(0, user.email.indexOf('@')),
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: null,
        deletedAt: null,
        isActive: true,
      })
    }

    if (user) {
      result = { isSuccess: true, message: 'ログインに成功しました' }
    }
  } catch (error) {
    if (
      error instanceof Error &&
      isFirebaseError(error) &&
      error.code === 'auth/user-not-found'
    ) {
      result = { isSuccess: false, message: 'ユーザが見つかりませんでした' }
    } else if (
      error instanceof Error &&
      isFirebaseError(error) &&
      error.code === 'auth/wrong-password'
    ) {
      result = { isSuccess: false, message: 'パスワードが間違っています' }
    } else {
      result = { isSuccess: false, message: 'ログインに失敗しました' }
    }
  }
  return result
}

/**
 * EmailとPasswordでサインアップ
 * @param username
 * @param email
 * @param password
 * @returns Promise<FirebaseResult>
 */
export const signUpWithEmail = async (args: {
  username: string
  email: string
  password: string
}): Promise<FirebaseResult> => {
  let result: FirebaseResult = { isSuccess: false, message: '' }
  try {
    const signUpUser = await createUserWithEmailAndPassword(
      auth,
      args.email,
      args.password
    )
    const user = signUpUser.user
    const docRef = doc(db, 'users', user.uid)

    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
    } else {
      await setDoc(docRef, {
        uid: user.uid,
        username: user.email?.substring(0, user.email.indexOf('@')),
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: null,
        deletedAt: null,
        isActive: true,
      })
    }
    if (user) {
      result = { isSuccess: true, message: '新規登録に成功しました' }
    }
  } catch (error) {
    if (
      error instanceof Error &&
      isFirebaseError(error) &&
      error.code === 'auth/email-already-in-use'
    ) {
      result = {
        isSuccess: false,
        message: 'メールアドレスが既に使用されています',
      }
    } else {
      result = { isSuccess: false, message: '新規登録に失敗しました' }
    }
  }
  return result
}

/**
 * ログアウト処理
 */
export const logout = async () => {
  await signOut(auth)
    .then(() => {
      console.log('ログアウトしました')
    })
    .catch((error) => {
      console.log(`ログアウト時にエラーが発生しました (${error})`)
    })
}
