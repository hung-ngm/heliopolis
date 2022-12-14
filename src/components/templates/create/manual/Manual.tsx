/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-template */
import { Heading, useColorModeValue } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import {
  FormControl,
  FormHelperText,
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
    const textColor = useColorModeValue('black', 'white');
    const bgTextColor = useColorModeValue('gray.200', 'gray.700');
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
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
            <Heading size="xl" marginBottom={6}>Create your own NFT</Heading>
            <Heading size="md" pt="10">Upload your image</Heading>
            <Container pt="10" ml="-5">
                <Upload selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
            </Container>

            <Heading size="md" pt="10">Name</Heading>
            <FormControl pt="4" isInvalid={name === ""}>
                <Input 
                    width="600px"
                    value = {name} 
                    onChange={handleNameChange} 
                    placeholder='Enter name here' 
                    bgColor={bgTextColor}
                    color={textColor}
                />
                <FormHelperText color={textColor}>Enter the name for the NFT</FormHelperText>
            </FormControl>

            <Heading size="md" pt="10">Description</Heading>
            <FormControl pt="4" isInvalid={description === ""}>
                <Textarea
                    width="600px"
                    height="200px"
                    value = {description}
                    onChange={handleDescriptionChange}
                    placeholder='Enter description here'
                    bgColor={bgTextColor}
                    color={textColor}
                />
                <FormHelperText color={textColor}>Enter the description for the NFT</FormHelperText>
            </FormControl>

            <Heading size="md" pt="10">Price</Heading>
            <FormControl pt="4" isInvalid={price === ""}>
                <Input 
                    width="600px"
                    value = {price} 
                    onChange={handlePriceChange} 
                    placeholder='Enter price here' 
                    bgColor={bgTextColor}
                    color={textColor}
                />
                <FormHelperText color={textColor}>Enter the Price (wei) MATIC for the NFT</FormHelperText>
            </FormControl>

            <Container pt="10" ml="-5">
                
            <Button isLoading={isMinting} colorScheme='blue' mr={3} onClick={async () => { await handleMint() }}>
                Mint
            </Button>
                
            </Container>
            
        </>
    );
};

export default Manual;