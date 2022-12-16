/* eslint-disable consistent-return */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-template */
import { Heading } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import {
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Input,
  Container,
  Textarea,
  Button,
  Image,
  useColorModeValue,
  useToast,
  ToastId,
} from '@chakra-ui/react';
import { generatePictureBase64 } from '@pages/api/ai/generatePictureBase64';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { mintNft } from '@pages/api/nft/mintNft';
import { TokenUri } from './types';

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const authorization = 'Basic ' + btoa(projectId + ':' + projectSecret);

const DallE: FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [image, setImage] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const textColor = useColorModeValue('black', 'white');
  const bgTextColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  const toastIdRef = React.useRef<ToastId>();
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const isValidName: boolean = name.length > 50 || name === '' ? false : true;
  const isValidDescription: boolean = description.length > 200 || description === '' ? false : true;
  const isValidPrice: boolean = price === '' || isNaN(Number(price)) || Number(price) < 0 ? false : true;

  const isMintable = (): boolean => {
    return isValidName && isValidDescription && isValidPrice && image !== '';
  };

  const isCreatable = (): boolean => {
    return prompt !== '';
  };

  const handleMint = async () => {
    if (!name || !description || !price) {
      return;
    }
    try {
      setIsMinting(true);
      const tokenUri: TokenUri = {
        name,
        description,
        image,
      };
      toastIdRef.current = toast({
        title: 'Executing...',
        description: 'You will be asked to sign TWICE',
        status: 'loading',
        position: 'top-left',
        duration: null,
      });
      await mintNft(tokenUri, price);
      updateToast(null);
      setIsMinting(false);
    } catch (e) {
      updateToast((e as { message: string })?.message);
      setIsMinting(false);
      console.log(e);
    }
  };

  const handleCreateImage = async (p: string) => {
    try {
      setIsCreating(true);
      setImage('');
      console.log(p);
      const b64 = await generatePictureBase64(p);
      if (b64) {
        const b64Url = `data:image/png;base64,${b64}`;
        setPreviewImage(b64Url);
        const uploadedUrl = await uploadToIpfs(b64Url);
        if (uploadedUrl) {
          console.log('uploadedUrl', uploadedUrl);
          setImage(uploadedUrl);
        }
      }
      console.log('image', image);
      setIsCreating(false);
    } catch (error) {
      console.log(error);
      setImage('');
    }
  };

  const uploadToIpfs = async (url: string) => {
    if (url) {
      try {
        const ipfs: IPFSHTTPClient = create({
          url: 'https://ipfs.infura.io:5001/api/v0',
          headers: {
            authorization,
          },
        });
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], 'file.png', { type: 'image/png' });

        const imghash = await ipfs.add(file);
        console.log(imghash);

        const newUrl = `https://infura-ipfs.io/ipfs/${imghash.path}`;

        return newUrl;
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateToast = (e: string | null) => {
    if (toastIdRef.current) {
      if (e === null) {
        toast.update(toastIdRef.current, {
          title: 'Mint successfully',
          description: 'Your NFT has mint and listed on marketplace.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast.update(toastIdRef.current, {
          title: 'Mint failed',
          description: e,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <>
      <Heading size="xl" marginBottom={6}>
        Use Dall-E to create your own NFT
      </Heading>

      {previewImage === '' ? (
        <>
          <Heading size="md" pt="10">
            Enter the prompt for Dall-E to create image
          </Heading>
          <FormControl pt="4" isInvalid={prompt === ''}>
            <Textarea
              width="600px"
              height="200px"
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Enter prompt here"
              bgColor={bgTextColor}
              color={textColor}
            />
            <FormHelperText color={textColor}>Enter the prompt for Dall-E to create image</FormHelperText>
          </FormControl>

          <Container pt="10" ml="-5">
            <Button
              isDisabled={!isCreatable()}
              isLoading={isCreating}
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                await handleCreateImage(prompt);
              }}
            >
              Create
            </Button>
          </Container>
        </>
      ) : (
        <>
          <Heading size="md" pt="10">
            Image created by Dall-E
          </Heading>
          <Container pt="10" ml="-5">
            <Image src={previewImage} alt="" width={400} />
          </Container>

          <Heading size="md" pt="10">
            Name
          </Heading>
          <FormControl pt="4" isInvalid={name === ''}>
            <Input
              width="600px"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter name here"
              bgColor={bgTextColor}
              color={textColor}
            />
            {isValidName ? (
              <FormHelperText>Enter the name for the NFT</FormHelperText>
            ) : (
              <FormErrorMessage>Name must not be empty and be less than 50 characters</FormErrorMessage>
            )}
          </FormControl>

          <Heading size="md" pt="10">
            Description
          </Heading>
          <FormControl pt="4" isInvalid={description === ''}>
            <Textarea
              width="600px"
              height="200px"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter description here"
              bgColor={bgTextColor}
              color={textColor}
            />
            {isValidDescription ? (
              <FormHelperText>Enter the description for the NFT</FormHelperText>
            ) : (
              <FormErrorMessage>Description must not be empty and be less than 200 characters</FormErrorMessage>
            )}
          </FormControl>

          <Heading size="md" pt="10">
            Price
          </Heading>
          <FormControl pt="4" isInvalid={price === ''}>
            <Input
              width="600px"
              value={price}
              onChange={handlePriceChange}
              placeholder="Enter price here"
              bgColor={bgTextColor}
              color={textColor}
            />
            {isValidPrice ? (
              <FormHelperText>Enter the Price (wei) MATIC for the NFT</FormHelperText>
            ) : (
              <FormErrorMessage>Price must be a number greater than 0</FormErrorMessage>
            )}
          </FormControl>

          <Container pt="10" ml="-5">
            <Button
              isDisabled={!isMintable()}
              isLoading={isMinting}
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                await handleMint();
              }}
            >
              Mint
            </Button>
          </Container>
        </>
      )}
    </>
  );
};

export default DallE;
