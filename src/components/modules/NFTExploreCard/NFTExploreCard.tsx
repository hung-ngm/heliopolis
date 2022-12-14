import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { INFTExploreCard } from './types';
import { NFTExploreCardInfo } from '../NFTExploreCardInfo';
import { NFTImage } from '../NFTImage';
import { NFTExploreButton } from '../NFTExploreButton';
const NFTExploreCard: FC<INFTExploreCard> = ({ name, description, image, price, tokenId }) => {
  const infoProps = { name, description, price, tokenId };
  const imageProps = { name, image };
  const viewProps = {name, description, image, price, tokenId};
  return (
    <Box maxWidth="315px" padding={1} borderRadius="xl">
      <NFTImage {...imageProps} />
      <NFTExploreCardInfo {...infoProps} />
      <NFTExploreButton {...viewProps}></NFTExploreButton>
    </Box>
  );
};

export default NFTExploreCard;
