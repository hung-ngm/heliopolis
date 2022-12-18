import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import { nftAddress, nftMarketplaceAddress } from 'utils/contracts';
import { nftMarketplaceAbi } from 'utils/nftMarketplaceAbi';
import { nftAbi } from 'utils/nftAbi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transferNft = async (addressFrom: string, addressTo: string, tokenId: number): Promise<boolean> => {
    try{
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const nftMarketplaceContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceAbi, signer);
        const nftContract = new ethers.Contract(nftAddress, nftAbi, signer);

        // The signer approve for the nftMarketplace to transfer NFT
        const approveTx = await nftContract.approve(nftMarketplaceAddress, tokenId, {
            gasLimit: 1000000,
            gasPrice: ethers.utils.parseUnits("10", "gwei"),
        });
        const approveTxReceipt = await approveTx.wait();
        console.log(approveTxReceipt);

        // Then the marketplace help transfer the NFT
        const transferTx = await nftMarketplaceContract.transferNft(nftAddress, tokenId, addressFrom, addressTo, {
            gasLimit: 1000000,
            gasPrice: ethers.utils.parseUnits("10", "gwei"),
            value: ethers.utils.parseEther("0.001"),
        });
        const transferTxReceipt = await transferTx.wait();
        console.log(transferTxReceipt);
        return true;        

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (e: any){
        console.log(e);
        return false;
    }
}