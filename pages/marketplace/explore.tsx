import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { IExplore } from 'components/templates/marketplace/Explore/types';
import { Explore } from 'components/templates/marketplace/Explore';
import { loadNfts } from '../api/nft/loadNfts';
import { TNFTExplore } from 'components/templates/marketplace/Explore/types';

const ERC20: NextPage<IExplore> = (props) => {
    const [nftsExplore, setNftsExplore] = useState<TNFTExplore[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchNftsExplore = async () => {
            const items = await loadNfts();
            setIsInitialLoading(false);
            setNftsExplore(items);
        }
        fetchNftsExplore();
    }, [nftsExplore])
    
    return (
        <Default pageName="ERC20 Balances">
            <Explore {...props} nftsExplore={nftsExplore} isInitialLoading={isInitialLoading} />
        </Default>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    if (!session?.user.address) {
        return { props: { error: 'Connect your wallet first' } };
    }

    return {
        props: {}
    };
};

export default ERC20;