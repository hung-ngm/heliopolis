import { Center, Button } from '@chakra-ui/react';
import { FC } from 'react';
import { INFTExploreButton } from './types';

import { buyNft } from '@pages/api/nft/buyNft';
const NFTExploreButton: FC<INFTExploreButton> = ({ price, tokenId }) => {
  const handleBuy = async () => {
    console.log('price', price);
    try {
      if (price) {
        const currentNft = {
          price,
          tokenId,
        };
        const res = await buyNft(currentNft);
        console.log(res);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Center>
      <Button
        marginTop={2}
        alignItems="center"
        onClick={async () => {
          await handleBuy();
        }}
      >
        Buy
      </Button>
    </Center>
  );
};

export default NFTExploreButton;
