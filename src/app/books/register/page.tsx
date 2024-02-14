'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { SlArrowLeft } from 'react-icons/sl'
import { useRecoilValue } from 'recoil'

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Spacer,
  Textarea,
  VStack,
} from '@/design'
import { registerBook } from '@/libs/apis/book'
import { userState } from '@/states/user'

// フォームで使用する変数の型を定義
type FormInputs = {
  title: string
  content: string
  image: File[]
}

const BookRegisterView = () => {
  const user = useRecoilValue(userState)
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>()
  const router = useRouter()
  const inputFileRef = React.useRef<HTMLInputElement>(null)

  const onSubmit = handleSubmit(async (data: FormInputs) => {
    registerBook({
      uid: user!.uid,
      title: data.title,
      content: data.content,
      imageURL: data.image,
    }).then(async () => {
      reset()
      router.back()
    })
  })

  return (
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
            <Heading padding='8px'>BOOK登録</Heading>
          </Flex>
          <Spacer />
        </Flex>
      </Flex>
      <form onSubmit={onSubmit}>
        <VStack spacing='4' alignItems='left'>
          <FormControl isInvalid={Boolean(errors.title)}>
            <FormLabel htmlFor='title' fontSize='12px'>
              本タイトル
            </FormLabel>
            <Input
              id='title'
              fontSize='12px'
              {...register('title', {
                required: '必須項目です',
                maxLength: {
                  value: 50,
                  message: '50文字以内で入力してください',
                },
              })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.content)}>
            <FormLabel htmlFor='content' fontSize='12px'>
              メモ
            </FormLabel>
            <Textarea
              resize='vertical'
              fontSize='12px'
              id='content'
              {...register('content', {
                required: '必須項目です',
                maxLength: {
                  value: 100,
                  message: '100文字以内で入力してください',
                },
              })}
            />
            <FormErrorMessage>
              {errors.content && errors.content.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.content)}>
            <FormLabel htmlFor='image' fontSize='12px'>
              画像
            </FormLabel>
            <Button onClick={() => inputFileRef.current?.click()}></Button>
            <Input
              border='none'
              fontSize='12px'
              id='image'
              type='file'
              multiple={false}
              accept='image/jpeg, image/png, image/gif, image/jpg'
              ref={inputFileRef}
              display='none'
            />
            <FormErrorMessage>
              {errors.image && errors.image.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            variant='none'
            bg='purple.200'
            width='100%'
            isLoading={isSubmitting}
            type='submit'
            shadow='lg'
          >
            登録
          </Button>
        </VStack>
      </form>
    </div>
  )
}

export default BookRegisterView
