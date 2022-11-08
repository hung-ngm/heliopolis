import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import {saveAs} from 'file-saver';
const PostImageToIPFS = async (url: any) => {
    /*
        Fetch image from an url then upload it to IPFS, then return the ipfs url
    */
    console.log(url)
    const response_image = await fetch(url,{
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin':'*',
            'Content-Type':'application/json'
        }
    });
    const blob_image = await response_image.blob();

    let file = new File([blob_image], "DallE");
    


    // var images : {cid: CID; path: string}[] = []
    // const projectId = process.env.IPFS_ID;
    // const projectSecret = process.env.IPFS_SECRET;
    // const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
    // let ipfs: IPFSHTTPClient | undefined;
    // try {
    //     ipfs = create({
    //         url: "https://ipfs.infura.io:5001/api/v0",
    //         headers: {
    //             authorization,
    //         },
    //     });
    // } catch (error) {
    //     console.error("IPFS error ", error);
    //     ipfs = undefined;
    // }

    // const result = await (ipfs as IPFSHTTPClient).add(file);

    // const uniquePaths = new Set([
    //     ...images.map((image) => image.path),
    //     result.path,
    // ]);

    
    // const uniqueImages = [...uniquePaths.values()]
    // .map((path) => {
    //     return [
    //         ...images,
    //         {
    //             cid: result.cid,
    //             path: result.path,
    //         },
    //     ].find((image) => image.path === path);
    // });
    // return "https://infura-ipfs.io/ipfs/" + uniqueImages[uniqueImages.length - 1]!.path
}
export default PostImageToIPFS;