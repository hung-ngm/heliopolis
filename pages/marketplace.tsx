import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { Marketplace, IMarketplace } from 'components/templates/marketplace';
import Moralis from 'moralis';

const MarketplacePage: NextPage<IMarketplace> = (_props) => {
  return (
    <Default pageName="NFT Marketplace">
      <Marketplace />
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
//   const transactions = await Moralis.EvmApi.account.getTransactions({
//     address: session?.user.address,
//     chain: process.env.APP_CHAIN_ID,
//   });


// eslint-disable-next-line etc/no-commented-out-code
  return {
    props: {
        // eslint-disable-next-line etc/no-commented-out-code
        //   transactions: JSON.parse(JSON.stringify(transactions.result)),
    },
  };
};

export default MarketplacePage;