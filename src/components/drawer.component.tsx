'use client'
import NextLink from 'next/link'
import { AiOutlineMenu } from 'react-icons/ai'

import {
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
              <NextLink href='/books'>Home</NextLink>
              <NextLink href='/profile'>Profile</NextLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
