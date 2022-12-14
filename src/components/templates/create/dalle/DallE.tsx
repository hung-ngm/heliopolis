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
  Input,
  Container,
  Textarea,
  Button,
  Image
} from '@chakra-ui/react';
import { generatePictureBase64 } from '@pages/api/ai/generatePictureBase64';
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { mintNft } from '@pages/api/nft/mintNft';
import { TokenUri } from './types';

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const DallE: FC = () => {
    const [prompt, setPrompt] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [image, setImage] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [isMinting, setIsMinting] = useState<boolean>(false);

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    }

    const isMintable = (): boolean =>  {
        if (price && isNaN(Number(price))) {
            return false;
        }
        if (name && description && price) {
            return true;
        }
        return false;
    }

    const isCreatable = () : boolean => {
        return prompt !== ""
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
                image,
            }
            const canMint = await mintNft(tokenUri, price);
            // If canMint, change the user to the explore page
            if (canMint) {
                setIsMinting(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleCreateImage = async (p: string) => {
        try {
            setIsCreating(true);
            setImage("");
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
            console.log("image", image);
            setIsCreating(false);
            
          } catch (error) {
            console.log(error);
            setImage("");
          }
    }

    const uploadToIpfs = async (url: string) => {
        if (url) {
          try {
            const ipfs: IPFSHTTPClient = create({
                url: "https://ipfs.infura.io:5001/api/v0",
                headers: {
                    authorization,
                },
            });
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], "file.png", { type: "image/png" });
    
            const imghash = await ipfs.add(file);
            console.log(imghash);
    
            const newUrl = `https://infura-ipfs.io/ipfs/${imghash.path}`;
    
            return newUrl;
          } catch (err) {
            console.log(err);
          }
        }
    }

    return (
        <>
            <Heading size="lg" marginBottom={6}>Use Dall-E to create your own NFT</Heading>

            {previewImage === "" ? (
                <>
                    <Heading size="md" pt="10">Enter the prompt for Dall-E to create image</Heading>
                    <FormControl pt="4" isInvalid={prompt === ""}>
                        <Textarea
                            width="600px"
                            height="200px"
                            value = {prompt}
                            onChange={handlePromptChange}
                            placeholder='Enter prompt here'
                        />
                        <FormHelperText>Enter the prompt for Dall-E to create image</FormHelperText>
                    </FormControl>

                    <Container pt="10" ml="-5">
                        <Button 
                            isDisabled={!isCreatable()}
                            isLoading={isCreating} 
                            colorScheme='blue' 
                            mr={3} 
                            onClick={async () => { await handleCreateImage(prompt) }}
                        >
                            Create
                        </Button>
                    </Container>
                </>
            ) : (
                <>  
                    <Heading size="md" pt="10">Image created by Dall-E</Heading>
                    <Container pt="10" ml="-5">
                        <Image
                            src={previewImage}
                            alt=""
                            width={400}
                        />
                    </Container>

                    <Heading size="md" pt="10">Name</Heading>
                    <FormControl pt="4" isInvalid={name === ""}>
                        <Input 
                            width="600px"
                            value = {name} 
                            onChange={handleNameChange} 
                            placeholder='Enter name here' 
                        />
                        <FormHelperText>Enter the name for the NFT</FormHelperText>
                    </FormControl>

                    <Heading size="md" pt="10">Description</Heading>
                    <FormControl pt="4" isInvalid={description === ""}>
                        <Textarea
                            width="600px"
                            height="200px"
                            value = {description}
                            onChange={handleDescriptionChange}
                            placeholder='Enter description here'
                        />
                        <FormHelperText>Enter the description for the NFT</FormHelperText>
                    </FormControl>

                    <Heading size="md" pt="10">Price</Heading>
                    <FormControl pt="4" isInvalid={price === ""}>
                        <Input 
                            width="600px"
                            value = {price} 
                            onChange={handlePriceChange} 
                            placeholder='Enter price here' 
                        />
                        <FormHelperText>Enter the Price (wei) MATIC for the NFT</FormHelperText>
                    </FormControl>

                    <Container pt="10" ml="-5">
                        
                    <Button 
                        isDisabled={!isMintable()}
                        isLoading={isMinting} 
                        colorScheme='blue' 
                        mr={3} 
                        onClick={async () => { await handleMint() }}
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