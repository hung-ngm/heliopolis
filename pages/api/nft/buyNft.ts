import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import { nftMarketplaceAddress, nftAddress } from 'utils/contracts';

import { nftMarketplaceAbi } from 'utils/nftMarketplaceAbi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buyNft = async (nft: any) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceAbi, signer);

    // Example nft:
    // { tokenId: "", price: "" }

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {
        value: price
    });
    await transaction.wait();
}