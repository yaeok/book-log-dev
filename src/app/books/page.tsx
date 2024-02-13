'use client'
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore'
import { register } from 'module'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { GrAdd } from 'react-icons/gr'
import { TiHeartFullOutline } from 'react-icons/ti'
import { useRecoilValue } from 'recoil'

import DrawerBtn from '@/components/drawer.component'
import Loading from '@/components/loading.component'
import {
  Button,
  Card,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useDisclosure,
} from '@/design'
import {
  updateFavoritebyBookId,
  updateIsCompletedbyBookId,
} from '@/libs/apis/book'
import { db } from '@/libs/config'
import { Book } from '@/models/book.model'
import { userState } from '@/states/user'

// フォームで使用する変数の型を定義
type FormInputs = {
  impressions: string
}

const tabList = [
  {
    id: 1,
    name: '読みたい',
    status: 'want',
  },
  {
    id: 2,
    name: '読んだ',
    status: 'read',
  },
  {
    id: 3,
    name: 'お気に入り',
    status: 'favorite',
  },
]

const BookListView = () => {
  const [books, setBooks] = React.useState<Book[]>([])
  const [selectBook, setSelectBook] = React.useState<Book | null>(null)
  const user = useRecoilValue(userState)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [selectTab, setSelectTab] = React.useState<string>('want')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>()

  React.useEffect(() => {
    if (user) {
      const colRef = collection(db, 'users', user!.uid, 'books')
      const q = query(
        colRef,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const lstBook: Book[] = []
        snapshot.forEach(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
            const recBook: Book = {
              bookId: doc.data().bookId,
              title: doc.data().title,
              content: doc.data().content,
              impressions: doc.data().impressions ?? '',
              favorite: doc.data().favorite,
              isCompleted: doc.data().isCompleted,
              completedAt: doc.data().completedAt,
              createdAt: doc.data().createdAt,
              updatedAt: doc.data().updatedAt,
              deletedAt: doc.data().deletedAt,
              isActive: doc.data().isActive,
            }
            lstBook.push(recBook)
          }
        )
        setBooks(lstBook)
        setLoading(false)
      })
      return () => {
        unsubscribe()
      }
    }
    setLoading(false)
  }, [])

  const onChangeCheckbox = async (args: {
    event: React.ChangeEvent<HTMLInputElement>
    recbook: Book
  }) => {
    setSelectBook(args.recbook)
    onOpen()
  }

  const onSubmit = handleSubmit(async (data: FormInputs) => {
    await updateIsCompletedbyBookId({
      uid: user!.uid,
      bookId: selectBook?.bookId!,
      impressions: data.impressions,
      isCompleted: true,
    })
    onClose()
  })

  const onTapTab = (status: string) => {
    setSelectTab(status)
  }

  const onTapFavorite = (recBook: Book) => {
    updateFavoritebyBookId({
      uid: user!.uid,
      bookId: recBook.bookId,
      favorite: !recBook.favorite,
    })
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Tabs>
        <Flex
          top='0'
          zIndex='10'
          position='sticky'
          paddingY='8px'
          flexDirection='column'
          bg='white'
          gap='4px'
        >
          <Flex
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Flex flexDirection='row' alignItems='center'>
              <DrawerBtn />
              <Heading padding='8px'>MY BOOK</Heading>
            </Flex>
            <IconButton
              aria-label=''
              icon={<GrAdd />}
              onClick={() => router.push('/books/register')}
              bg='white'
              borderRadius='25'
              shadow='lg'
            />
          </Flex>
          <TabList>
            {tabList.map((tab, index) => (
              <Tab
                key={index}
                fontSize='12px'
                onClick={() => onTapTab(tab.status)}
              >
                {tab.name}
              </Tab>
            ))}
          </TabList>
        </Flex>
        <TabPanels>
          {tabList.map((tab) => (
            <TabPanel key={tab.id} m='0' p='0'>
              {books
                .filter((book) => {
                  switch (selectTab) {
                    case 'want':
                      return !book.isCompleted
                    case 'read':
                      return book.isCompleted
                    case 'favorite':
                      return book.favorite
                    default:
                      return false
                  }
                })
                .map((book, index) => (
                  <div key={index}>
                    <Card marginY='8px'>
                      <Flex
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                        padding='8px'
                        borderBottom='1px'
                        borderColor='gray.200'
                      >
                        <IconButton
                          aria-label=''
                          variant='none'
                          icon={<TiHeartFullOutline />}
                          color={book.favorite ? 'pink.500' : 'gray.200'}
                          bg='white'
                          marginRight='8px'
                          onClick={() => onTapFavorite(book)}
                        />
                        <Flex
                          width='100%'
                          flexDirection='column'
                          cursor='pointer'
                          onClick={() => router.push(`/books/${book.bookId}`)}
                        >
                          <Heading fontSize='14px'>{book.title}</Heading>
                          <Heading fontSize='12px' color='gray.500'>
                            {book.content}
                          </Heading>
                        </Flex>
                        <Checkbox
                          checked={book.isCompleted}
                          disabled={tab.status === 'want' ? false : true}
                          onChange={(event) => {
                            onChangeCheckbox({ event, recbook: book })
                          }}
                        />
                      </Flex>
                    </Card>
                  </div>
                ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <Modal
        size='xs'
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
        allowPinchZoom={false}
        blockScrollOnMount={true}
      >
        <ModalOverlay />
        <form onSubmit={onSubmit}>
          <ModalContent>
            <ModalHeader fontSize='16px'>{selectBook?.title!}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={Boolean(errors.impressions)}>
                <FormLabel htmlFor='impressions' fontSize='12px'>
                  感想
                </FormLabel>
                <Textarea
                  resize='vertical'
                  fontSize='12px'
                  id='impressions'
                  {...register('impressions', {
                    required: '必須項目です',
                    maxLength: {
                      value: 200,
                      message: '200文字以内で入力してください',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.impressions && errors.impressions.message}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                variant='none'
                border='2px'
                borderColor='purple.200'
                marginTop='16px'
                isLoading={isSubmitting}
                type='submit'
                shadow='lg'
              >
                完了
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </div>
  )
}

export default BookListView
