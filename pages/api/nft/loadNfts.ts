import { ethers } from 'ethers';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

import { nftaddress, nftmarketaddress } from '../../../cache/deploy';

import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../../artifacts/contracts/HeliopolisMarketplace.sol/HeliopolisMarketplace.json';

export const loadNfts = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_URL);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = await Promise.all(data.map(async (i: any) => {
        
        // eslint-disable-next-line etc/no-commented-out-code
        // const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // const meta = await axios.get(tokenUri);
        
        const tokenUri = await tokenContract.tokenURI(i.tokenId);

        const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        const item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            
            // eslint-disable-next-line etc/no-commented-out-code
            // image: meta.data.image,
            // name: meta.data.name,
            // description: meta.data.description,

            image: "",
            name: "",
            description: "",
            uri: tokenUri
        }
        return item
    }))
    return items;

}