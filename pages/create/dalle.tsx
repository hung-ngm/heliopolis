import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { IExplore } from 'components/templates/marketplace/Explore/types';
import { DallE } from 'components/templates/create/dalle';


const ERC20: NextPage<IExplore> = () => {
    return (
        <Default pageName="ERC20 Balances">
            <DallE />
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