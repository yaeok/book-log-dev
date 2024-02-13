import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { db } from '@/libs/config'

export const registerBook = async (args: {
  title: string
  content: string
  uid: string
}) => {
  const colRef = collection(db, 'users', args.uid, 'books')
  await addDoc(colRef, {
    title: args.title,
    content: args.content,
    favorite: false,
    isCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: null,
    deletedAt: null,
    completedAt: null,
    isActive: true,
  }).then((docRef) => {
    setDoc(docRef, { bookId: docRef.id }, { merge: true })
  })
}

export const updateIsCompletedbyBookId = async (args: {
  uid: string
  bookId: string
  isCompleted: boolean
}) => {
  const docRef = doc(db, 'users', args.uid, 'books', args.bookId)
  await setDoc(
    docRef,
    {
      isCompleted: args.isCompleted,
      updatedAt: serverTimestamp(),
      completedAt: args.isCompleted ? serverTimestamp() : null,
    },
    { merge: true }
  )
}

export const updateFavoritebyBookId = async (args: {
  uid: string
  bookId: string
  favorite: boolean
}) => {
  const docRef = doc(db, 'users', args.uid, 'books', args.bookId)
  await setDoc(
    docRef,
    {
      favorite: args.favorite,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
