'use client'
import NextLink from 'next/link'
import { AiOutlineMenu } from 'react-icons/ai'

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  VStack,
} from '@/design'

export default function DrawerBtn() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div>
      <IconButton
        aria-label=''
        borderRadius='25'
        bg='white'
        onClick={() => onOpen()}
      >
        <AiOutlineMenu />
      </IconButton>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen} size='xs'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing='4' align='left'>
              <NextLink href='/todos'>ToDoリスト</NextLink>
              <NextLink href='/books'>Bookリスト</NextLink>
              <NextLink href='/trips'>Tripリスト</NextLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
