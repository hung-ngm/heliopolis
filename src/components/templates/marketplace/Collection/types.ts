export type TNFTCollection = {
    description: string;
    image: string;
    name: string;
    owner: string;
    price: string;
    seller: string;
    tokenId: number;
}

export interface ICollection {
    myNfts?: TNFTCollection[];
}

