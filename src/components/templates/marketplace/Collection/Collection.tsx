import { Box, Grid, Heading } from '@chakra-ui/react';
import { NFTCollectionCard } from 'components/modules';
import React, { FC, useEffect, useState } from 'react';
import { ICollection } from './types';
import { useDisclosure } from '@chakra-ui/react';
import {
  Button,
  Center,
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
  Image
} from '@chakra-ui/react';


const Collection: FC<ICollection> = ({ myNfts }) => {
    useEffect(() => console.log('myNfts', myNfts), [myNfts]);
    // Popup
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    // const delay = (ms : any) => new Promise(res => setTimeout(res, ms));
    // Form
    const [descriptionInput, setDescriptionInput] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const [isEmptyDescription, setIsEmptyDescription] = useState(true);
    const [isError, setIsError] = useState(true);
    // Sell button 
    const [isListing, setIsListing] = useState(false); 
    // Image
    const [isImageOn, setIsImageOn] = useState(false);
    // Mint button 
    const [isMinting, setIsMinting] = useState(false); 

    const handleInputChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescriptionInput(e.target.value);
      // eslint-disable-next-line no-unused-expressions
      (e.target.value.trim() === '') ? setIsEmptyDescription(true) : setIsEmptyDescription(false); 
    }

    const handleInputChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriceInput(e.target.value);
      // eslint-disable-next-line no-unused-expressions
      (e.target.value.trim() === '' || 
      !Number.isInteger(Number(e.target.value)) || 
      Number(e.target.value) < 0) ? setIsError(true) : setIsError(false); 
    }
    
    const handleSubmit = async () =>{
      setIsListing(true);
      await handleSell();
      setIsListing(false);
    }
    const handleMint = async () => {
      setIsMinting(true);
      await new Promise(res => setTimeout(res, 5000)); // add minting logic here
      setIsMinting(false);
    }

    const handleSell = async () => {
      setIsListing(true);
      try{
        const price = priceInput;
        // console.log(`Selling token ${  tokenId  } with price ${  price  } wei` )
        const currentNft = {
          "price" : Number(price)
        };
        // const res = await resellNft(currentNft);
        // console.log(res);
        alert("Sold");
        setIsListing(false);
      }catch (e: any){
        alert(e.message)
        console.log(e.message);
        setIsListing(false);
      }
    }

    return (
    <>
      <Heading size="lg" marginBottom={6}>
        This is your NFT collection
        <Button marginLeft = {3} alignItems="center" >
          Mint
        </Button>
        <Button marginLeft = {3}alignItems="center" onClick={onOpen} ref={finalRef}>
            Mint by AI
        </Button>
        <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
            <ModalContent>
              <ModalHeader>Mint by AI</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl isInvalid={isEmptyDescription}>
                  <FormLabel>Description</FormLabel>
                  <Input ref={initialRef} value = {descriptionInput} onChange={handleInputChangeDescription} placeholder='A cute litte cat' />
                  <FormHelperText> Describe your image </FormHelperText>
                </FormControl>
                <br/>
                <Center>
                  <Image
                    boxSize='256px'
                    objectFit='cover'
                    src='https://bit.ly/dan-abramov'
                    alt='Dan Abramov'
                  />
                </Center>
                
              </ModalBody>

              <ModalFooter>
                {isEmptyDescription ? (
                  <Button disabled colorScheme='blue' mr={3}>
                    Mint
                  </Button>) : (
                    !isMinting ? (
                      <Button colorScheme='blue' mr={3} onClick={async () => await handleMint()}>
                        Mint
                      </Button>
                    ):(
                      <Button isLoading colorScheme='blue' mr={3}>
                        Mint
                      </Button>
                    ))
                }
                {!isImageOn ?(
                    <Button disabled colorScheme='blue' mr={3}>
                      Sell
                    </Button>) : (<Button disabled colorScheme='blue' mr={3}>
                      Sell
                    </Button>)
                }
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
      </Heading>
      {myNfts?.length? (
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {myNfts.map((nft, key) => (
            <NFTCollectionCard {...nft} key={key} />
          ))}
        </Grid>
      ) : (
        <Box>Looks Like there you have no NFTs right now</Box>
      )}
    </>
  );
};

export default Collection;