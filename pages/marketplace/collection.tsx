import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { ICollection } from 'components/templates/marketplace/Collection/types';
import { Collection } from 'components/templates/marketplace/Collection';

const ERC20: NextPage<ICollection> = (props) => {
  return (
    <Default pageName="ERC20 Balances">
      <Collection {...props} />
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  if (!session?.user.address) {
    return { props: { error: 'Connect your wallet first' } };
  }

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
        
    // eslint-disable-next-line etc/no-commented-out-code
    //   balances: JSON.parse(JSON.stringify(tokensWithLogosAdded)),
    },
  };
};

export default ERC20;