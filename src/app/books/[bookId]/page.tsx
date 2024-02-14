'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { SlArrowLeft } from 'react-icons/sl'
import { useRecoilValue } from 'recoil'

import Loading from '@/components/loading.component'
import {
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Square,
  Text,
  useToast,
  VStack,
} from '@/design'
import { getBookbyBookId } from '@/libs/apis/firestore/book'
import { Book } from '@/models/book.model'
import { userState } from '@/states/user'

type BookDetailViewProps = {
  params: { bookId: string }
}

const BookDetailView = ({ params }: BookDetailViewProps) => {
  const [book, setBook] = React.useState<Book | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const user = useRecoilValue(userState)
  const toast = useToast()
  const router = useRouter()

  React.useEffect(() => {
    const fetchBook = async () => {
      const recBook: Book | null = await getBookbyBookId({
        uid: user!.uid,
        bookId: params.bookId,
      })
      if (recBook) {
        setBook(recBook)
      } else {
        toast({
          title: 'データ取得に失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        router.back()
      }
      setLoading(false)
    }
    fetchBook()
  }, [])
  return loading ? (
    <Loading />
  ) : (
    <div>
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
            <IconButton
              aria-label=''
              icon={<SlArrowLeft />}
              onClick={() => router.back()}
              bg='white'
              borderRadius='25'
              shadow='lg'
            />
            <Heading padding='8px'>{book!.title}</Heading>
          </Flex>
          <Button>更新</Button>
        </Flex>
      </Flex>
      <Flex
        flexDirection='column'
        justifyContent='center'
        gap='32px'
        alignItems='center'
        marginY='8px'
      >
        <Square size='xs' bg='gray.200' borderRadius='10px'></Square>
        <VStack align='left' minW='100%'>
          <Heading fontSize='20px'>メモ</Heading>
          <Divider borderColor='purple.300' />
          <Text fontSize='12px'>
            {book!.content ? book!.content : 'まだ登録されていません。'}
          </Text>
        </VStack>
        <VStack align='left' minW='100%'>
          <Heading fontSize='20px'>感想</Heading>
          <Divider borderColor='purple.300' />

          <Text fontSize='12px'>
            {book!.impressions ? book!.impressions : 'まだ登録されていません。'}
          </Text>
        </VStack>
        <VStack align='left' minW='100%'>
          <Heading fontSize='20px'>情報</Heading>
          <Divider borderColor='purple.300' />

          <Flex flexDirection='row' gap='16px' width='100%'>
            <Text fontSize='12px'>登録日</Text>
            <Text fontSize='12px'>{book!.createdAt}</Text>
          </Flex>
          <Flex flexDirection='row' gap='16px' width='100%'>
            <Text fontSize='12px'>読破日</Text>
            <Text fontSize='12px'>{book!.completedAt}</Text>
          </Flex>
        </VStack>
        <Flex flexDirection='row' gap='8px' width='100%'>
          <Button width='100%' variant='none' bg='purple.200'>
            読んだ
          </Button>
          <Button
            width='100%'
            variant='none'
            borderColor='purple.200'
            border='2px'
          >
            お気に入り
          </Button>
        </Flex>
      </Flex>
    </div>
  )
}

export default BookDetailView
