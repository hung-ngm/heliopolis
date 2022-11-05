/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers';
import { getURI } from 'utils/getURI';
import * as dotenv from 'dotenv';
dotenv.config();

import { nftMarketplaceAddress, nftAddress } from 'utils/contracts';

import { nftAbi } from 'utils/nftAbi';
import { nftMarketplaceAbi } from 'utils/nftMarketplaceAbi';
import { TokenUri } from 'components/templates/marketplace/Explore/types';

export const loadNfts = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_URL);
    const tokenContract = new ethers.Contract(nftAddress, nftAbi, provider);
    const marketContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceAbi, provider);
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(data.map(async (i: any) => {
        const tokenUriString = await tokenContract.tokenURI(i.tokenId);
        const tokenUri : TokenUri = getURI(tokenUriString);
        
        const wei = ethers.utils.formatUnits(i.price.toString(), 'wei');
        const item = {
            price: (Number(wei)).toString(),
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: tokenUri.image,
            name: tokenUri.name,
            description: tokenUri.description,
        }

        return item
    }))
    return items;

}