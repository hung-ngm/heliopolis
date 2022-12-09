import React, { FC, useState } from 'react';
import { INFTCollectionButton } from './types';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Button, Center, useDisclosure } from '@chakra-ui/react';
import { resellNft } from '@pages/api/nft/sellNft';

const NFTCollectionButton: FC<INFTCollectionButton> = ({tokenId}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(true);
  const [isListing, setIsListing] = useState(false); 
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // eslint-disable-next-line no-unused-expressions
    (e.target.value.trim() === '' || 
    !Number.isInteger(Number(e.target.value)) || 
    Number(e.target.value) < 0) ? setIsError(true) : setIsError(false); 
  }

  const handleSubmit = async () =>{
    setIsListing(true);
    await handleResell();
    setIsListing(false);
  }
  
  const handleResell = async () => {
    setIsListing(true);
    try{
      const price = input;
      console.log(`Selling token ${  tokenId  } with price ${  price  } wei` )
      const currentNft = {
        "price" : Number(price), 
        "tokenId" : Number(tokenId)
      };
      const res = await resellNft(currentNft);
      console.log(res);
      setIsListing(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any){
      console.log(e.message);
      setIsListing(false);
    }
  }

  return (
    <Center>
      <Button marginTop={2} alignItems="center" onClick={onOpen} ref={finalRef}>
        Sell
      </Button>

      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sell your token</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={isError}>
              <FormLabel>Price (MATIC)</FormLabel>
              <Input ref={initialRef} value={input} onChange={handleInputChange} placeholder="Enter your price" />
              {!isError ? (
                <FormHelperText>*Only integer price</FormHelperText>
              ) : (
                <FormErrorMessage>Enter a valid price</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {isError ? (
              // eslint-disable-next-line no-return-await
              <Button disabled colorScheme="blue" mr={3} onClick={async () => await handleSubmit()}>
                Sell
              </Button>
            ) : !isListing ? (
              // eslint-disable-next-line no-return-await
              <Button colorScheme="blue" mr={3} onClick={async () => await handleSubmit()}>
                Sell
              </Button>
            ) : (
              <Button isLoading colorScheme="blue" mr={3}>
                Sell
              </Button>
            )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};

export default NFTCollectionButton;
