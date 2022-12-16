import { ethers } from 'ethers';
import { getURI } from 'utils/getURI';
import * as dotenv from 'dotenv';
dotenv.config();

import { nftMarketplaceAddress, nftAddress } from 'utils/contracts';

import { nftAbi } from 'utils/nftAbi';
import { nftMarketplaceAbi } from 'utils/nftMarketplaceAbi';
import { TokenUri } from 'components/templates/marketplace/types';

export const loadMyNfts = async (address: string) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_URL);
    const tokenContract = new ethers.Contract(nftAddress, nftAbi, provider);
    const marketContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceAbi, provider);
    const data = await marketContract.fetchNFTsByAddress(address);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = await Promise.all(data.map(async (i: any) => {
        const tokenUriString = await tokenContract.tokenURI(i.tokenId);
        const tokenUri : TokenUri = getURI(tokenUriString);

        const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        const item = {
            price: (Number(price) * (10**18)).toString(),
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