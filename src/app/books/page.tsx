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
import { useRouter } from 'next/navigation'
import React from 'react'
import { GrAdd } from 'react-icons/gr'
import { useRecoilValue } from 'recoil'

import DrawerBtn from '@/components/drawer.component'
import Loading from '@/components/loading.component'
import {
  Button,
  Flex,
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
  useDisclosure,
} from '@/design'
import { db } from '@/libs/config'
import { updateIsCompletedbyBookId } from '@/libs/firebase/book'
import { Book } from '@/models/book.model'
import { userState } from '@/states/user'

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
  const user = useRecoilValue(userState)
  const [loading, setLoading] = React.useState<boolean>(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

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
        const lstUpdBook: Book[] = lstBook.filter((todo: Book) => {
          return todo.isCompleted === false
        })
        setBooks(lstUpdBook)
        setLoading(false)
      })
      return () => {
        unsubscribe()
      }
    }
    setLoading(false)
  }, [])

  const unCompletedBooks = () => {
    const lstUpdBook: Book[] = books.filter((todo: Book) => {
      return todo.isCompleted === false
    })
    setBooks(lstUpdBook)
  }

  const completedBooks = () => {
    const lstUpdBook: Book[] = books.filter((todo: Book) => {
      return todo.isCompleted === true
    })
    setBooks(lstUpdBook)
  }

  const onChangeCheckbox = async (args: {
    event: React.ChangeEvent<HTMLInputElement>
    bookId: string
  }) => {
    await updateIsCompletedbyBookId({
      uid: user!.uid,
      bookId: args.bookId,
      isCompleted: args.event.target.checked,
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
              <Tab key={index} fontSize='12px'>
                {tab.name}
              </Tab>
            ))}
          </TabList>
        </Flex>
        <TabPanels>
          {tabList.map((tab, index) => (
            <TabPanel key={index} m='0' p='0'>
              {books
                .filter((book) => {
                  return tab.status === 'want'
                    ? !book.isCompleted && !book.favorite
                    : book.isCompleted && tab.status === 'read'
                })
                .map((book, index) => (
                  <div key={index}>
                    <Flex
                      flexDirection='row'
                      justifyContent='space-between'
                      alignItems='center'
                      padding='8px'
                      borderBottom='1px'
                      borderColor='gray.200'
                    >
                      <Flex flexDirection='column'>
                        <Heading fontSize='14px'>{book.title}</Heading>
                        <Heading fontSize='12px' color='gray.500'>
                          {book.content}
                        </Heading>
                      </Flex>
                      <Flex flexDirection='row' alignItems='center'>
                        <input
                          type='checkbox'
                          checked={book.isCompleted}
                          onChange={(event) => {
                            onChangeCheckbox({ event, bookId: book.bookId })
                          }}
                        />
                      </Flex>
                    </Flex>
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
        <ModalContent>
          <ModalHeader fontSize='16px'></ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default BookListView
