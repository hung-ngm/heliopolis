/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Grid, Heading } from '@chakra-ui/react';
import { NFTCollectionCard } from 'components/modules';
import React, { FC, useState, useEffect } from 'react';
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
  Image,
  Spinner
} from '@chakra-ui/react';
import { generatePicture } from '@pages/api/ai/generatePicture';
import { generatePictureBase64 } from '@pages/api/ai/generatePictureBase64';
import { mintNft } from '@pages/api/nft/mintNft';
import { mintAINft } from '@pages/api/nft/mintAINft';
import { TokenUri } from '../Explore/types';
import { TNFTCollection } from './types';
import { loadMyNfts } from '@pages/api/nft/loadMyNfts';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import { saveAs } from 'file-saver';

import Upload from './Upload';

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const Collection: FC<ICollection> = ({ userAddress }) => {
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const[images, setImages] = React.useState<{cid: CID; path: string}[]> ([]);

    // First prompt
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenManual, onOpen: onOpenManual, onClose: onCloseManual} = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    // State
    const [isListing, setIsListing] = useState(false); 
    const [isImageOn, setIsImageOn] = useState(false);
    const [isCreating, setIsCreating] = useState(false); 
    const [isMinting, setIsMinting] = useState(false);
    
    // Fields in the form
    const [image, setImage] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState('');

    // Fields checkers
    const [isEmptyPrompt, setIsEmptyPrompt] = useState(true);
    const [isEmptyName, setIsEmptyName] = useState(true);
    const [isEmptyDescription, setIsEmptyDescription] = useState(true);
    const [isEmptyPrice, setIsEmptyPrice] = useState(true);
    const [isErrorPrice, setIsErrorPrice] = useState(true);

    const [myNfts, setMyNfts] = useState<TNFTCollection[]>([]);

    let ipfs: IPFSHTTPClient;
    try {
        ipfs = create({
            url: "https://ipfs.infura.io:5001/api/v0",
            headers: {
                authorization,
            },
        });
    } catch (error) {
        console.error("IPFS error ", error);
    }
    
    useEffect(() => {
      const fetchMyNfts = async () => {
        if (userAddress) {
          const items = await loadMyNfts(userAddress);
          setIsInitialLoading(false);
          setMyNfts(items);
        }
      }
      fetchMyNfts();
      
    }, [myNfts, userAddress]) 


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
      Number(e.target.value) < 0) ? setIsErrorPrice(true) : setIsErrorPrice(false); 
    }
    
    const handleCreatePicture = async (p: string) => {
      try {
        setIsCreating(true);
        console.log(p);
        const b64 = await generatePictureBase64(p);
        if (b64) {
          setImage(`data:image/png;base64,${b64}`);
        }
        console.log(image);
        setIsCreating(false);
        
      } catch (error) {
        console.log(error);
      }
    }

    // // Upload image file created by base64 to IPFS
    const uploadToIpfs = async () => {
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "file.png", { type: "image/png" });

        console.log('file is', file);

        // Download file
        saveAs(file, "file.png");

        const result = await (ipfs as IPFSHTTPClient).add(file);

        const uniquePaths = new Set([
          ...images.map((img) => img.path),
          result.path,
        ]);

        const uniqueImages = [...uniquePaths.values()]
        .map((path) => {
            return [
                ...images,
                {
                    cid: result.cid,
                    path: result.path,
                },
            ].find((img) => img.path === path);
        });

        return "https://infura-ipfs.io/ipfs/" + uniqueImages[uniqueImages.length - 1]!.path;
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
        handleCancel();
      } catch (error) {
        console.log(error);
      }
    }

    const handleAIMint = async () => {
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
        const canMint = await mintAINft(tokenUri, price);
        const uploaded = await uploadToIpfs();
        console.log('uploaded', uploaded);
        // If canMint, change the user to the explore page
        if (canMint) {
          setIsMinting(false);
          onClose();
        }
        handleCancel();
      } catch (error) {
        console.log(error);
      }
    }

    const handleCancel = () => {
      onCloseManual();
      onClose();
      reset();
    }

    const reset = () => {
      setPrompt('');
      setPrice('');
      setIsEmptyPrompt(true);
      setIsErrorPrice(true);
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
        {/* Mint manually */}
        <Button marginLeft = {3} alignItems="center" onClick={onOpenManual} ref={finalRef}>
          Mint
        </Button>
        <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenManual} onClose={handleCancel}>
          <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create NFT</ModalHeader>
              <ModalCloseButton/>
              
              <ModalBody pb={3}>
                <Center>
                  <Upload parent_image={image} parent_setImage={setImage}/>
                </Center>
              </ModalBody>

                  <ModalBody pb={3}>
                    <FormControl isInvalid={isEmptyName}>
                      <FormLabel>Name</FormLabel>
                      <Input 
                        value = {name} 
                        onChange={handleNameChange} 
                        placeholder='Enter name here' 
                      />
                      <FormHelperText>Enter the name for the NFT</FormHelperText>
                    </FormControl>
                  </ModalBody>


                  <ModalBody pb={3}>
                    <FormControl isInvalid={isEmptyDescription}>
                      <FormLabel>Description</FormLabel>
                      <Input 
                        value = {description} 
                        onChange={handleDescriptionChange} 
                        placeholder='Enter the description here' 
                      />
                      <FormHelperText>Enter the description for the NFT</FormHelperText>
                    </FormControl>
                  </ModalBody>
                
                  <ModalBody pb={3}>
                    <FormControl isInvalid={isEmptyPrice}>
                      <FormLabel>Price</FormLabel>
                      <Input 
                        value = {price} 
                        onChange={handlePriceChange} 
                        placeholder='Enter the price here' 
                      />
                      <FormHelperText>Enter the Price (MATIC) for the NFT</FormHelperText>
                    </FormControl>
                  </ModalBody>


                <ModalFooter>
                  {(!isMinting) ? (
                    ( image === 'loading...' || 
                      image === '' || 
                      isEmptyName || 
                      isEmptyDescription || 
                      isEmptyPrice || 
                      isErrorPrice) ? (
                      <Button isDisabled colorScheme='blue' mr={3}>
                        Mint
                      </Button>
                    ) : (
                      <Button colorScheme='blue' mr={3} onClick={async () => { await handleMint() }}>
                        Mint
                      </Button>
                    )
                  ) : (
                    <Button isLoading loadingText='Prepare to sign twice' colorScheme='blue' mr={3}>
                      Mint
                    </Button>
                  )}
                  <Button onClick={handleCancel}>Cancel</Button>
                </ModalFooter>

              
            </ModalContent>
        </Modal>

        {/* Mint with Dall-E */}
        <Button marginLeft = {3}alignItems="center" onClick={onOpen} ref={finalRef}>
            Mint with DALL-E
        </Button>
        <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={handleCancel}>
          <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create NFT with DALL-E</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={3}>
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
                      alt='An image'
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
                  <ModalBody pb={3}>
                    <FormControl isInvalid={isEmptyName}>
                      <FormLabel>Name</FormLabel>
                      <Input 
                        value = {name} 
                        onChange={handleNameChange} 
                        placeholder='Enter name here' 
                      />
                      <FormHelperText>Enter the name for the NFT</FormHelperText>
                    </FormControl>
                  </ModalBody>
                ) : null}

                {image ? (
                  <ModalBody pb={3}>
                    <FormControl isInvalid={isEmptyDescription}>
                      <FormLabel>Description</FormLabel>
                      <Input 
                        value = {description} 
                        onChange={handleDescriptionChange} 
                        placeholder='Enter the description here' 
                      />
                      <FormHelperText>Enter the description for the NFT</FormHelperText>
                    </FormControl>
                  </ModalBody>
                ) : null}

                {image ? (
                  <ModalBody pb={3}>
                    <FormControl isInvalid={isEmptyPrice}>
                      <FormLabel>Price</FormLabel>
                      <Input 
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
                        (isEmptyName || isEmptyDescription || isEmptyPrice || isErrorPrice) ? (
                          <Button isDisabled colorScheme='blue' mr={3} onClick={async () => { await handleAIMint() }}>
                            Mint
                          </Button>
                        ) : (
                          <Button colorScheme='blue' mr={3} onClick={async () => { await handleAIMint() }}>
                            Mint
                          </Button>
                        )
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
        isInitialLoading ? (
          <Center>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />  
          </Center>
          
        ) : (
          <>
            <Box>Look like you are not owning any NFT.</Box>

            <br/>
            <Center>
              <Image src='/empty_market.webp' alt="empty" />
            </Center>
          </>
          
        )
      )}
    </>
  );
};

export default Collection;