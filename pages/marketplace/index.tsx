import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { IExplore } from 'components/templates/marketplace/types';
import { Explore } from 'components/templates/marketplace';
import { loadNfts } from '../api/nft/loadNfts';

const ERC20: NextPage<IExplore> = (props) => {    
    return (
        <Default pageName="Marketplace">
            <Explore {...props} />
        </Default>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    if (!session?.user.address) {
        return { props: { error: 'Connect your wallet first' } };
    }

    const items = await loadNfts();

    return {
        props: {
            nftsExplore: items
        }
    };
};

export default ERC20;