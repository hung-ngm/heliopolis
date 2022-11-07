import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import { nftAddress } from 'utils/contracts';

import { nftAbi } from 'utils/nftAbi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transferNft = async (addressFrom: string, addressTo: string, tokenId: number): Promise<boolean> => {
    try{
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nftAddress, nftAbi, signer);
        const transferTx = await nftContract.transferFrom(addressFrom, addressTo, tokenId);
        const transferTxReceipt = await transferTx.wait();
        console.log(transferTxReceipt);
        return true;        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (e: any){
        console.log(e);
        return false;
    }
}