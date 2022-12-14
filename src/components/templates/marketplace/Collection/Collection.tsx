/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Grid, Heading, useColorModeValue, Center, Image } from '@chakra-ui/react';
import React, { FC } from 'react';
import { NFTCollectionCard } from 'components/modules';
import { ICollection } from './types';

const Collection: FC<ICollection> = ({ myNfts }) => {
  const headerColor = useColorModeValue('black', 'white');

  return (
    <>
      <Center>
        <Heading size="xl" marginBottom={6} borderColor={headerColor} padding={'10px'} borderRadius={10} borderWidth={5}>
          MY NFT COLLECTION
        </Heading>
      </Center>
      {myNfts?.length ? (
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {myNfts.map((nft, key) => (
            <NFTCollectionCard {...nft} key={key} />
          ))}
        </Grid>
      ) : (
        <>
          <Box>Look like you are not owning any NFT.</Box>

          <br />
          <Center>
            <Image src="/empty_market.webp" alt="empty" />
          </Center>
        </>
      )}
    </>
  );
};

export default Collection;
