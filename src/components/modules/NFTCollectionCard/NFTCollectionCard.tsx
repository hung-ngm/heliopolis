/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
import { Box, Image, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { FC } from 'react';
import { INFTCollectionCard } from './types';
import { Button } from '@chakra-ui/react';
import { Center} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from '@chakra-ui/react';
import { resellNft } from '@pages/api/nft/sellNft';

const NFTCollectionCard: FC<INFTCollectionCard> = ({ name, description, image, tokenId }) => {
  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  
  // Popup
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  
  // Form
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(true);
  // Sell button 
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

    // eslint-disable-next-line no-alert
    alert("hello")
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
      alert("Sold");
      setIsListing(false);
    } catch (e: any){
      alert(e.message)
      console.log(e.message);
      setIsListing(false);
    }
  }
  return (
    <Box maxWidth="315px" bgColor={bgColor} padding={3} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
      <Box maxHeight="260px" overflow={'hidden'} borderRadius="xl">
        <Image
          src={`${image}`}
          alt={'nft'}
          minH="260px"
          minW="260px"
          boxSize="100%"
          objectFit="fill"
        />
      </Box>
      <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2}>
        {name}
      </Box>
      <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
        <Box>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
            Description
          </Box>
          <Box as="h4" noOfLines={1} fontSize="sm">
            {description}
          </Box>
        </Box>
      </SimpleGrid>
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
                  <Input ref={initialRef} value = {input} onChange={handleInputChange} placeholder='Enter your price' />
                  {!isError ? (
                    <FormHelperText> 
                      *Only integer price
                    </FormHelperText>
                  ) : (
                    <FormErrorMessage>Enter a valid price</FormErrorMessage>
                  )}
                </FormControl>
              </ModalBody>

              <ModalFooter>
                {isError ? (
                  <Button disabled colorScheme='blue' mr={3} onClick={async () => await handleSubmit()}>
                    Sell
                  </Button>) : (!isListing ? (
                  <Button colorScheme='blue' mr={3} onClick={async () => await handleSubmit()}>
                    Sell
                  </Button>
                ):(
                  <Button isLoading colorScheme='blue' mr={3}>
                    Sell
                  </Button>
                ))}
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
      </Center>
    </Box>
  );
};

export default NFTCollectionCard;