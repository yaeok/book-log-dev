import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import {
  getBookImageUrl,
  registerBookFromStorage,
} from '@/libs/apis/storage/book'
import { db } from '@/libs/config'
import { convertTimestampToStr } from '@/libs/firebase/utils'
import { Book } from '@/models/book.model'

export const registerBook = async (args: {
  title: string
  content: string
  uid: string
  imageURL: File[]
}): Promise<void> => {
  const colRef = collection(db, 'users', args.uid, 'books')
  let url = ''
  if (args.imageURL.length > 0) {
    url = await registerBookFromStorage({
      file: args.imageURL,
      uid: args.uid,
    })
  }
  await addDoc(colRef, {
    title: args.title,
    content: args.content,
    imageURL: url,
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
  impressions: string
  isCompleted: boolean
}): Promise<void> => {
  const docRef = doc(db, 'users', args.uid, 'books', args.bookId)
  await setDoc(
    docRef,
    {
      isCompleted: args.isCompleted,
      impressions: args.impressions,
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
}): Promise<void> => {
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

export const getBookbyBookId = async (args: {
  uid: string
  bookId: string
}): Promise<Book | null> => {
  const docRef = doc(db, 'users', args.uid, 'books', args.bookId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const cnvCreatedAt = convertTimestampToStr(
      docSnap.data().createdAt?.seconds
    )
    const cnvUpdatedAt = convertTimestampToStr(
      docSnap.data().updatedAt?.seconds
    )
    const cnvDeletedAt = convertTimestampToStr(
      docSnap.data().deletedAt?.seconds
    )
    const cnvCompletedAt = convertTimestampToStr(
      docSnap.data().completedAt?.seconds
    )
    let imageURL: string = ''
    if (docSnap.data().imageURL) {
      imageURL = await getBookImageUrl({
        uid: args.uid,
        imageURL: docSnap.data().imageURL,
      })
    }
    return {
      bookId: docSnap.id,
      title: docSnap.data().title,
      content: docSnap.data().content,
      impressions: docSnap.data().impressions,
      favorite: docSnap.data().favorite,
      imageURL: imageURL,
      isCompleted: docSnap.data().isCompleted,
      completedAt: cnvCompletedAt,
      createdAt: cnvCreatedAt,
      updatedAt: cnvUpdatedAt,
      deletedAt: cnvDeletedAt,
      isActive: docSnap.data().isActive,
    }
  } else {
    return null
  }
}
