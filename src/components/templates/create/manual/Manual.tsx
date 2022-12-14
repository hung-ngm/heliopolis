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
  Button
} from '@chakra-ui/react';
import Upload from './Upload';
import { create, CID, IPFSHTTPClient } from 'ipfs-http-client';
import { TokenUri } from './types';
import { mintNft } from '@pages/api/nft/mintNft';

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const authorization = 'Basic ' + btoa(projectId + ':' + projectSecret);


const Manual: FC = () => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [isMinting, setIsMinting] = useState<boolean>(false);
    const [images, setImages] = React.useState<{ cid: CID; path: string }[]>([]);
    const [uploaded, setUploaded] = React.useState(false);
    const [ipfsImageUrl, setIpfsImageUrl] = useState<string>("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    }

    const isValidName : boolean = (name.length > 50 || name === "") ? false : true;
    const isValidDescription : boolean = (description.length > 200 || description === "") ? false : true;
    const isValidPrice : boolean = (price === "" || isNaN(Number(price)) || Number(price) < 0) ? false : true;

    const isMintable = (): boolean =>  {
        if (isValidName && isValidDescription && isValidPrice && selectedFile) {
            return true;
        }
        return false;
    }

    const handleMint = async () => {
        if (!name || !description || !price) {
            return;
        }
        try {
            setIsMinting(true);
            const ipfsClient = create({
                url: 'https://ipfs.infura.io:5001/api/v0',
                headers: {
                    authorization
                }
            })
            if (selectedFile) {
                const result = await (ipfsClient as IPFSHTTPClient).add(selectedFile);

                const uniquePaths : any = new Set([...images.map((image) => image.path), result.path]);
                
                const uniqueImages = [...uniquePaths.values()].map((path) => {
                    return [
                    ...images,
                    {
                        cid: result.cid,
                        path: result.path,
                    },
                    ].find((image) => image.path === path);
                });
                const ipfsUrl: string = 'https://infura-ipfs.io/ipfs/' + uniqueImages[uniqueImages.length - 1]!.path;
                console.log(ipfsUrl);
                setUploaded(true);
                const tokenUri: TokenUri = {
                    name,
                    description,
                    image: ipfsUrl
                }
                const canMint = await mintNft(tokenUri, price);
                // If canMint, change the user to the explore page
                if (canMint) {
                    setIsMinting(false);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Heading size="lg" marginBottom={6}>Create your own NFT</Heading>
            <Heading size="md" pt="10">Upload your image</Heading>
            <Container pt="10" ml="-5">
                <Upload selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
            </Container>

            <Heading size="md" pt="10">Name</Heading>
            <FormControl pt="4" isInvalid={!isValidName}>
                <Input 
                    width="600px"
                    value = {name} 
                    onChange={handleNameChange} 
                    placeholder='Enter name here' 
                />
                {isValidName ? (
                    <FormHelperText>Enter the name for the NFT</FormHelperText>
                ) : (
                    <FormErrorMessage>Name must not be empty and be less than 50 characters</FormErrorMessage>
                )}
            </FormControl>

            <Heading size="md" pt="10">Description</Heading>
            <FormControl pt="4" isInvalid={!isValidDescription}>
                <Textarea
                    width="600px"
                    height="200px"
                    value = {description}
                    onChange={handleDescriptionChange}
                    placeholder='Enter description here'
                />
                {isValidDescription ? (
                    <FormHelperText>Enter the description for the NFT</FormHelperText>
                ) : (
                    <FormErrorMessage>Description must not be empty and be less than 200 characters</FormErrorMessage>
                )}
            </FormControl>

            <Heading size="md" pt="10">Price</Heading>
            <FormControl pt="4" isInvalid={!isValidPrice}>
                <Input 
                    width="600px"
                    value = {price} 
                    onChange={handlePriceChange} 
                    placeholder='Enter price here' 
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
                colorScheme='blue' 
                mr={3} 
                onClick={async () => { await handleMint() }}
            >
                Mint
            </Button>
                
            </Container>
            
        </>
    );
};

export default Manual;