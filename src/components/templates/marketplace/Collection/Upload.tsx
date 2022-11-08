import React from "react";
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import {Button,Center,Image} from '@chakra-ui/react';
import empty_image from '@public/empty_image.png';

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

type Props = {
    parent_image: string;
    parent_setImage: (val: string) => void;
};

const Upload: React.FC<Props> = ({parent_image, parent_setImage}) => {
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
    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement;
        const files = (form[0] as HTMLInputElement).files;
        if (!files || files.length === 0) {
            return alert("No files selected");
        }
        parent_setImage('loading...');
        const file = files[0];
        try{
            // upload files
            const result = await (ipfs as IPFSHTTPClient).add(file);

            const uniquePaths = new Set([
                ...images.map((image) => image.path),
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
                ].find((image) => image.path === path);
            });

            // @ts-ignore
            // setImages(uniqueImages);
            parent_setImage("https://infura-ipfs.io/ipfs/" + uniqueImages[uniqueImages.length - 1]!.path)
            setUploaded(true);
            form.reset();
        }catch(error){
            parent_setImage("");
            form.reset();
        }
        
    };

    return (
        <div>
            {ipfs && (
                <>  

                    <Center>
                        <form onSubmit={onSubmitHandler}>
                            <input name="file" type="file" />
                            {(!uploaded) ?
                                <Button type="submit">Upload File</Button>:
                                <Button disabled type="submit">Upload File</Button>
                            }
                        </form>
                    </Center>
                    <br/>
                    
                    <Center>
                        {(parent_image !== '') ?
                            (parent_image != 'loading...') ?
                                (<Image alt={"Upload image"} src={parent_image} boxSize='256px' objectFit='contain'/>) :
                                (<Image alt={"Upload image"} src={'/loading.svg'} boxSize='256px' objectFit='contain'/>)
                                : 
                            (<Image alt={""} src={empty_image.src} boxSize='256px' objectFit='contain'/>)
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

export default Upload;
