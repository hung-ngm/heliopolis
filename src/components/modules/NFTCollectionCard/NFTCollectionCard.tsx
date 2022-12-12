/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
import {Box} from '@chakra-ui/react';
import { FC } from 'react';
import { INFTCollectionCard } from './types';
import { NFTImage } from '../NFTImage';
import { NFTCollectionCardInfo } from '../NFTCollectionCardInfo';
import { NFTCollectionButton } from '../NFTCollectionButton';
import React from 'react';


const NFTCollectionCard: FC<INFTCollectionCard> = ({ name, description, image, tokenId }) => {
  const imageProps = {name, image};
  const infoProps = {name, description, image, tokenId};
  const sellProps = {name, tokenId};
  
  return (
    <Box maxWidth="315px" padding={1} borderRadius="xl">
      <NFTImage {...imageProps}/>
      <NFTCollectionCardInfo {...infoProps}/>
      <NFTCollectionButton {...sellProps}/>
    </Box>
  );
};

export default NFTCollectionCard;