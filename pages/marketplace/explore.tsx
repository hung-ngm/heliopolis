import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { IExplore } from 'components/templates/marketplace/Explore/types';
import { Explore } from 'components/templates/marketplace/Explore';
import { loadNfts } from '../api/nft/loadNfts';


const ERC20: NextPage<IExplore> = (props) => {
    return (
        <Default pageName="ERC20 Balances">
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

// eslint-disable-next-line etc/no-commented-out-code
//   const balances = await Moralis.EvmApi.account.getTokenBalances({
//     address: session?.user.address,
//     chain: process.env.APP_CHAIN_ID,
//   });

//   const tokensWithLogosAdded = balances.toJSON().map((balance) => ({
//     ...balance,
//     token: {
//       ...balance.token,
//       logo: getErc20LogoAddress({
//         blockchain: 'ethereum',
//         address: EvmAddress.create(balance.token?.contractAddress || '').checksum,
//       }),
//     },
//   }));

  return {
    props: {
        marketplace: {
            items
        }
    },
  };
};

export default ERC20;