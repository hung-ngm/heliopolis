import React from "react";
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import {Button,Center,Image} from '@chakra-ui/react';

const projectId = '2GlEQt6XrchD7AH58sc3jYEszna';
const projectSecret = 'dacc6911679d6e19d824919933800232';
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
type Props = {
    parent_image: string;
    parent_setImage: (val: string) => void;
};
const Upload: React.FC<Props> = ({parent_image, parent_setImage}) => {
    const[images, setImages] = React.useState<{cid: CID; path: string}[]> ([]);
    
    
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
    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const files = (form[0] as HTMLInputElement).files;
        if (!files || files.length === 0) {
            return alert("No files selected");
        }

        const file = files[0];
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
        setImages(uniqueImages);
        parent_setImage("https://infura-ipfs.io/ipfs/" + uniqueImages[uniqueImages.length - 1]!.path) // set parent's 'image' to the newest url
        form.reset();
    };

    return (
        <div>
            {ipfs && (
                <>
                    <Center>
                        <form onSubmit={onSubmitHandler}>
                        <input name="file" type="file" />

                        <Button type="submit">Upload File</Button>
                        </form>
                    </Center>
                    <br/>
                    
                    <Center>
                    <Image alt={"Upload image"} src={parent_image} boxSize='256px' objectFit='contain'/>
                    
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
