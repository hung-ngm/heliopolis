/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Button,
  SimpleGrid,
  HStack,
  VStack,
  Image,
  Text,
  Box,
  Badge,
  useToast,
  ToastId,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { INFTExploreModal } from './types';

import { buyNft } from '@pages/api/nft/buyNft';
const NFTExploreModal: FC<INFTExploreModal> = ({ name, description, image, price, tokenId, isOpen, onClose }) => {
  const finalRef = React.useRef(null);
  const toast = useToast();
  const toastIdRef = React.useRef<ToastId>();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const updateToast = (e: string | null) => {
    if (toastIdRef.current) {
      if (e === null) {
        toast.update(toastIdRef.current, {
          title: 'Purchase successful',
          description: 'Your NFT has been purchased.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast.update(toastIdRef.current, {
          title: 'Purchase failed',
          description: e,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const onBuyButtonClick = async () => {
    try {
      setIsProcessing(true);
      toastIdRef.current = toast({
        title: 'Executing...',
        description: 'You will be asked to sign a transaction',
        status: 'loading',
        position: 'top-left',
        duration: null,
      });
      await handleBuy().then(() => onClose());
      updateToast(null);
      setIsProcessing(false);
    } catch (e) {
      updateToast((e as { message: string })?.message);
      console.log(e);
      setIsProcessing(false);
    }
  };

  const handleBuy = async () => {
    console.log('price', price);
    try {
      if (price) {
        const currentNft = {
          price,
          tokenId,
        };
        const res = await buyNft(currentNft);
        console.log(res);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Center>
                <Box maxWidth="500px" maxHeight="500px" overflow={'hidden'}>
                  <Image
                    src={`${image}`}
                    alt={'nft'}
                    minWidth={'400px'}
                    minHeight={'400px'}
                    boxSize="100%"
                    objectFit="contain"
                  />
                </Box>
              </Center>
              <Center>
                <Text fontSize={25} fontWeight={'bold'}>
                  {' '}
                  {name}{' '}
                  <Badge fontWeight="bold" fontSize="20px" colorScheme={'green'}>
                    #{tokenId}
                  </Badge>
                </Text>
              </Center>

              <Center>
                <Box>
                  <Text as={'i'} fontWeight={'normal'} fontSize={'20px'}>
                    {`${description}`}
                  </Text>
                </Box>
              </Center>
            </VStack>
          </ModalBody>

          <ModalFooter gap={'5px'}>
            <HStack gap={'1px'}>
              <Image src={`/weiLogo.png`} alt={'wei'} boxSize="10%" objectFit="contain" />
              <Text as="span" fontWeight={'bold'} fontSize={'30px'}>
                {' '}
                {price}
              </Text>
            </HStack>
            <Button
              isLoading={isProcessing}
              colorScheme="green"
              mr={3}
              onClick={async () => {
                await onBuyButtonClick();
              }}
            >
              Buy
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NFTExploreModal;
