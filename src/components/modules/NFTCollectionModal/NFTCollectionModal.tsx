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
  VStack,
  Image,
  Text,
  Box,
  Badge,
  useToast,
  ToastId,
} from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { resellNft } from '@pages/api/nft/sellNft';
import React, { FC, useState } from 'react';
import { INFTCollectionModal } from './types';

const NFTCollectionModal: FC<INFTCollectionModal> = ({ name, description, image, tokenId, isOpen, onClose, itemId }) => {
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(true);
  const [isListing, setIsListing] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const toast = useToast();
  const toastIdRef = React.useRef<ToastId>();

  const updateToast = (e: string | null) => {
    if (toastIdRef.current) {
      if (e === null) {
        toast.update(toastIdRef.current, {
          title: 'Sell successful',
          description: 'Your NFT has been sold.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast.update(toastIdRef.current, {
          title: 'Transaction failed',
          description: e,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // eslint-disable-next-line no-unused-expressions
    e.target.value.trim() === '' || !Number.isInteger(Number(e.target.value)) || Number(e.target.value) < 0
      ? setIsError(true)
      : setIsError(false);
  };

  const handleSubmit = async () => {
    try {
      setIsListing(true);
      toastIdRef.current = toast({
        title: 'Executing...',
        description: 'You will be asked to sign a transaction',
        status: 'loading',
        position: 'top-left',
        duration: null,
      });

      await handleResell().then(() => onClose());
      updateToast(null);
      setIsListing(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e : any) {
      console.log(e.message);
      updateToast((e as { message: string })?.message);
      setIsListing(false);
    }
  };

  const handleResell = async () => {
    setIsListing(true);

    const price = input;
    console.log(`Selling token ${tokenId} with itemId ${itemId} with price ${price} wei`);
    const currentNft = {
      price: Number(price),
      itemId: Number(itemId),
    };
    const res = await resellNft(currentNft);
    console.log(res);
    setIsListing(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  };

  return (
    <>
      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size={'xl'}>
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
                <Center>
                  <Text as={'i'} fontWeight={'normal'} fontSize={'20px'}>
                    {`${description}`}
                  </Text>
                </Center>
              </Center>
              <Center>
                <Box>
                  <FormControl isInvalid={isError}>
                    <FormLabel fontWeight={'bold'}>Price (MATIC)</FormLabel>
                    <Input
                      isRequired
                      ref={initialRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Enter your price"
                      width={{ lg: '400px', md: '400px', sm: '400px' }}
                    />
                    {!isError ? (
                      <FormHelperText>*Only integer price</FormHelperText>
                    ) : (
                      <FormErrorMessage>*Enter a valid integer price</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </Center>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              disabled={isError}
              isLoading={isListing}
              colorScheme="green"
              mr={3}
              // eslint-disable-next-line no-return-await
              onClick={async () => await handleSubmit()}
            >
              Sell
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NFTCollectionModal;
