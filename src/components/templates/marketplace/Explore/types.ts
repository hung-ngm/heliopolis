export type TNFTExplore = {
    description: string;
    image: string;
    name: string;
    owner: string;
    price: string;
    seller: string;
    tokenId: number;
}

export interface IExplore {
    nftsExplore?: TNFTExplore[];
    isInitialLoading: Boolean;
}

export type TokenUri = {
    name: string;
    description: string;
    image: string;
}
