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

  return {
    props: {
      userAddress: session.user.address
    },
  };
};

export default ERC20;