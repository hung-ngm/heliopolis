/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Grid, Heading, useColorModeValue } from '@chakra-ui/react';
import { NFTCollectionCard } from 'components/modules';
import React, { FC, useState, useEffect } from 'react';
import { ICollection } from './types';
import { useDisclosure } from '@chakra-ui/react';
import { Center, Image } from '@chakra-ui/react';
import { generatePictureBase64 } from '@pages/api/ai/generatePictureBase64';
import { mintNft } from '@pages/api/nft/mintNft';
import { TokenUri } from '../Explore/types';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const authorization = 'Basic ' + btoa(projectId + ':' + projectSecret);

const Collection: FC<ICollection> = ({ myNfts }) => {
  const headerColor = useColorModeValue('black', 'white');

  // First prompt
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenManual, onOpen: onOpenManual, onClose: onCloseManual } = useDisclosure();
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

  let ipfs: IPFSHTTPClient;
  try {
    ipfs = create({
      url: 'https://ipfs.infura.io:5001/api/v0',
      headers: {
        authorization,
      },
    });
  } catch (error) {
    console.error('IPFS error ', error);
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    e.target.value.trim() === '' ? setIsEmptyPrompt(true) : setIsEmptyPrompt(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    e.target.value.trim() === '' ? setIsEmptyName(true) : setIsEmptyName(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    e.target.value.trim() === '' ? setIsEmptyDescription(true) : setIsEmptyDescription(false);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
    e.target.value.trim() === '' ? setIsEmptyPrice(true) : setIsEmptyPrice(false);

    e.target.value.trim() === '' || !Number.isInteger(Number(e.target.value)) || Number(e.target.value) < 0
      ? setIsErrorPrice(true)
      : setIsErrorPrice(false);
  };

  const handleCreatePicture = async (p: string) => {
    try {
      setIsCreating(true);
      setImage('loading...');
      console.log(p);
      const b64 = await generatePictureBase64(p);
      if (b64) {
        const b64Url = `data:image/png;base64,${b64}`;
        const uploadedUrl = await uploadToIpfs(b64Url);
        if (uploadedUrl) {
          console.log('uploadedUrl', uploadedUrl);
          setImage(uploadedUrl);
        }
      }
      console.log(image);
      setIsCreating(false);
    } catch (error) {
      console.log(error);
      setImage('');
    }
  };

  // // Upload image file created by base64 to IPFS
  const uploadToIpfs = async (url: string) => {
    if (url) {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'file.png', { type: 'image/png' });

      const imghash = await ipfs.add(file);
      console.log(imghash);

      const newUrl = `https://infura-ipfs.io/ipfs/${imghash.path}`;

      return newUrl;
    }
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
  };

  const handleAIMint = async () => {
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
  };

  const handleCancel = () => {
    onCloseManual();
    onClose();
    reset();
  };

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
  };

  return (
    <>
      <Center>
        <Heading size="xl" marginBottom={6} borderColor={headerColor} padding={'10px'} borderRadius={10} borderWidth={5}>
          YOUR NFT COLLECTION
        </Heading>
      </Center>
      {myNfts?.length ? (
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {myNfts.map((nft, key) => (
            <NFTCollectionCard {...nft} key={key} />
          ))}
        </Grid>
      ) : (
        <>
          <Box>Look like you are not owning any NFT.</Box>

          <br />
          <Center>
            <Image src="/empty_market.webp" alt="empty" />
          </Center>
        </>
      )}
    </>
  );
};

export default Collection;
