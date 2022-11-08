/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-alert */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-template */
import React from "react";
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import {Button,Center,Image} from '@chakra-ui/react';
import empty_image from '@public/empty_image.png';
import axios, {AxiosRequestConfig} from 'axios';

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

type Props = {
    parent_image: string;
    parent_setImage: (val: string) => void;
    dalleUrl: string;
};

const UploadAI: React.FC<Props> = ({parent_image, parent_setImage, dalleUrl}) => {
    const[images, setImages] = React.useState<{cid: CID; path: string}[]> ([]);
    const[uploaded, setUploaded] = React.useState(false);
    // IPFS client 
    let ipfs: IPFSHTTPClient | undefined;
    try {
        ipfs = create({
            url: "https://ipfs.infura.io:5001/api/v0",
            headers: {
                authorization,
            },
        });
        
    } catch (error) {
        console.error("IPFS error ", error);
        ipfs = undefined;
    }
    
    // Handler
    

    // New handler
    const uploadImageToIPFS = async () => {
        console.log(dalleUrl);
        var config : AxiosRequestConfig = {
            
            headers: {
                        'Access-Control-Allow-Origin': '*', 
                        'mode': 'no-cors'
                        
                    },
            responseType: 'blob'
            
        };
        const file = await axios.get(dalleUrl, config).then(response => {return response.data;});
        console.log(file)
        try {
        const added = await ipfs?.add(
            file,
            {
            progress: (prog) => console.log(`received: ${prog}`)
            }
        )
        const url = `https://ipfs.infura.io/ipfs/${added?.path}`;
        console.log(url);
        } catch (error) {
            console.log('Error uploading file: ', error);
        }
    }
    return (
        <div>
            {ipfs && (
                <>  

                    {/* <Center>
                        <form onSubmit={onSubmitHandler}>
                            <input name="file" type="file" />
                            {(!uploaded) ?
                                <Button type="submit">Upload File</Button>:
                                <Button disabled type="submit">Upload File</Button>
                            }
                        </form>
                    </Center> */}

                    <Button onClick= {async() => {await uploadImageToIPFS()}}>
                        Show Image
                    </Button>
                    <Center>
                        {(parent_image !== '') ?
                            (parent_image !== 'loading...') ?
                                (<Image alt={"Upload image"} src={parent_image} boxSize='256px' objectFit='contain'/>) :
                                (<Image alt={"Upload image"} src={'/loading.svg'} boxSize='256px' objectFit='contain'/>)
                                : 
                            (<Image alt={"EmptyImage"} src={empty_image.src} boxSize='256px' objectFit='contain'/>)
                        }
                    </Center>
                </>
            )}

        {!ipfs && (
            <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
        )}
        </div>
    );
}

export default UploadAI;
