import loadImage from 'blueimp-load-image'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { storage } from '@/libs/config'

export const registerBookFromStorage = async (args: {
  file: File[]
  uid: string
}): Promise<string> => {
  const urlList = new Array<string>()
  for (const item of args.file) {
    /** 画像圧縮 */
    const canvas = await loadImage(item, {
      maxWidth: 300,
      maxHeight: 300,
      canvas: true,
    })
    if (canvas.image instanceof HTMLCanvasElement) {
      canvas.image.toBlob(async (blob: Blob | null) => {
        if (blob) {
          const change = new File([blob], item.name, {
            type: blob.type,
            lastModified: Date.now(),
          })
          const fullPath = 'books' + args.uid + item.name
          const uploadRef = ref(storage, fullPath)

          await uploadBytes(uploadRef, change)
        }
      })
    }
    urlList.push(item.name)
  }
  return urlList[0]
}

export const getBookImageUrl = async (imageURL: string): Promise<string> => {
  const reference = ref(
    storage,
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_URL + imageURL
  )
  const url = getDownloadURL(reference)
    .then((url) => {
      return url
    })
    .catch((err) => {
      console.log(err)
      return ''
    })
  return url
}
