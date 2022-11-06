/* eslint-disable no-unused-expressions */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { generatePicture } from '@pages/api/ai/generatePicture';
import { mintNft } from '@pages/api/nft/mintNft';
import { TokenUri } from '../Explore/types';


const Collection: FC<ICollection> = ({ myNfts }) => {
    useEffect(() => console.log('myNfts', myNfts), [myNfts]);
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const initialNameRef = React.useRef(null);
    const initialDescriptionRef = React.useRef(null);
    const initialPriceRef = React.useRef(null);
    const finalRef = React.useRef(null)
    const [price, setPrice] = useState('');
    const [isEmptyPrompt, setIsEmptyPrompt] = useState(true);
    const [isEmptyName, setIsEmptyName] = useState(true);
    const [isEmptyDescription, setIsEmptyDescription] = useState(true);
    const [isEmptyPrice, setIsEmptyPrice] = useState(true);
    const [isError, setIsError] = useState(true);
    const [isListing, setIsListing] = useState(false); 
    const [isImageOn, setIsImageOn] = useState(false);
    const [isCreating, setIsCreating] = useState(false); 
    const [isMinting, setIsMinting] = useState(false);
    const [image, setImage] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');


    const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrompt(e.target.value);
      (e.target.value.trim() === '') ? setIsEmptyPrompt(true) : setIsEmptyPrompt(false); 
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      (e.target.value.trim() === '') ? setIsEmptyName(true) : setIsEmptyName(false); 
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
      (e.target.value.trim() === '') ? setIsEmptyDescription(true) : setIsEmptyDescription(false); 
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrice(e.target.value);
      e.target.value.trim() === '' ? setIsEmptyPrice(true) : setIsEmptyPrice(false);
      
      (e.target.value.trim() === '' || 
      !Number.isInteger(Number(e.target.value)) || 
      Number(e.target.value) < 0) ? setIsError(true) : setIsError(false); 
    }
    
    const handleCreatePicture = async (p: string) => {
      try {
        setIsCreating(true);
        console.log(p);
        const picture = await generatePicture(p);
        if (picture) {
          setImage(picture);
        }
        console.log(image);
        setIsCreating(false);
      } catch (error) {
        console.log(error);
      }
      
    }

    const handleMint = async () => {
      if (!name || !description || !price) {
        return;
      }
      try {
        setIsMinting(true);
        const tokenUri: TokenUri = {
          name,
          description,
          image
        }
        const canMint = await mintNft(tokenUri, price);
        // If canMint, change the user to the explore page
        if (canMint) {
          setIsMinting(false);
          onClose();
        }
      } catch (error) {
        console.log(error);
      }
    }

    const handleCancel = () => {
      onClose();
      reset();
    }

    const reset = () => {
      setPrompt('');
      setPrice('');
      setIsEmptyPrompt(true);
      setIsError(true);
      setIsListing(false);
      setIsImageOn(false);
      setIsCreating(false);
      setImage('');
      setName('');
      setDescription('');
      setIsEmptyName(true);
      setIsEmptyDescription(true);
      setIsEmptyPrice(true);
      setIsMinting(false);
    }

    return (
    <>
      <Heading size="lg" marginBottom={6}>
        This is your NFT collection
        <Button marginLeft = {3} alignItems="center" >
          Mint
        </Button>
        <Button marginLeft = {3}alignItems="center" onClick={onOpen} ref={finalRef}>
            Mint with DALL-E
        </Button>
        <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create NFT with DALL-E</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                {!image ? (
                  <FormControl isInvalid={isEmptyPrompt}>
                    <FormLabel>Prompt</FormLabel>
                    <Input 
                      ref={initialRef} 
                      value = {prompt} 
                      onChange={handlePromptChange} 
                      placeholder='Enter the prompt here' 
                    />
                    <FormHelperText>Describe your image</FormHelperText>
                  </FormControl>
                ) : null}
                
                <br/>
                {image ? (
                  <Center>
                    <Image
                      boxSize='256px'
                      objectFit='cover'
                      src={image}
                      alt='Dan Abramov'
                    />
                  </Center>
                ) : null }
              </ModalBody>

              <ModalFooter>
                {!image ? (
                  (isEmptyPrompt) ? (
                    <Button disabled colorScheme='blue' mr={3}>
                      Create
                    </Button>) : (
                      (!isCreating) ? (
                        <Button colorScheme='blue' mr={3} onClick={async () => { await handleCreatePicture(prompt)}}>
                          Create
                        </Button>
                      ): (
                        <Button isLoading colorScheme='blue' mr={3}>
                          Mint
                        </Button>
                      ))
                ) : null}
                
              </ModalFooter>
                
                {image ? (
                  <ModalBody pb={6}>
                    <FormControl isInvalid={isEmptyName}>
                      <FormLabel>Name</FormLabel>
                      <Input 
                        ref={initialNameRef} 
                        value = {name} 
                        onChange={handleNameChange} 
                        placeholder='Enter name here' 
                      />
                      <FormHelperText>Enter the name for the NFT</FormHelperText>
                    </FormControl>
                  </ModalBody>
                ) : null}

                {image ? (
                  <ModalBody pb={6}>
                    <FormControl isInvalid={isEmptyDescription}>
                      <FormLabel>Description</FormLabel>
                      <Input 
                        ref={initialDescriptionRef} 
                        value = {description} 
                        onChange={handleDescriptionChange} 
                        placeholder='Enter the description here' 
                      />
                      <FormHelperText>Enter the description for the NFT</FormHelperText>
                    </FormControl>
                  </ModalBody>
                ) : null}

                {image ? (
                  <ModalBody pb={6}>
                    <FormControl isInvalid={isEmptyPrice}>
                      <FormLabel>Price</FormLabel>
                      <Input 
                        ref={initialPriceRef} 
                        value = {price} 
                        onChange={handlePriceChange} 
                        placeholder='Enter the price here' 
                      />
                      <FormHelperText>Enter the Price (MATIC) for the NFT</FormHelperText>
                    </FormControl>
                  </ModalBody>
                ) : null}

                <ModalFooter>
                  {image ? (
                      (!isMinting) ? (
                        <Button colorScheme='blue' mr={3} onClick={async () => { await handleMint() }}>
                          Mint
                        </Button>
                      ) : (
                        <Button isLoading colorScheme='blue' mr={3}>
                          Mint
                        </Button>
                      )
                    ) : null
                  }
                  
                  {image ? (
                    <Button onClick={handleCancel}>Cancel</Button>
                  ) : null}
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