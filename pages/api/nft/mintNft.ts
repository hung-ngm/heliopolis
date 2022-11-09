import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { TokenUri } from 'components/templates/marketplace/Explore/types';

import { nftMarketplaceAddress, nftAddress } from 'utils/contracts';

import { nftMarketplaceAbi } from 'utils/nftMarketplaceAbi';
import { nftAbi } from 'utils/nftAbi';

export const mintNft = async (nftUri: TokenUri, nftPrice: string): Promise<boolean> => {
    try{
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        // Create NFT Token
        const nftContract = new ethers.Contract(nftAddress, nftAbi, signer);
        const createNftTx = await nftContract.createToken(`{"name": "${nftUri.name}", "description": "${nftUri.description}", "image": "${nftUri.image}"}`)
        const resNftCreated = await createNftTx.wait();
        const [transferEvent] = resNftCreated.events;
        const { tokenId } = transferEvent.args;

        // List to the Heliopolis Marketplace
        const marketplaceContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceAbi, signer);

        const price = ethers.utils.parseUnits(nftPrice, 'wei');
        const listMarketTx = await marketplaceContract.createMarketItem(nftAddress, Number(tokenId), price, {
            gasLimit: 10000000,
            gasPrice: ethers.utils.parseUnits("10", "gwei"),
            value: ethers.utils.parseEther("0.001"),
        });
    
        const res = await listMarketTx.wait();
        console.log(res);

        return true;
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (e: any){
        console.log('error', e);
        return false;
    }
}