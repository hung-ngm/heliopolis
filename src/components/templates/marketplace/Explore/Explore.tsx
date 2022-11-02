import { Box, Grid, Heading } from '@chakra-ui/react';
import { NFTExploreCard } from 'components/modules';
import React, { FC, useEffect } from 'react';
import { IExplore } from './types';

const Explore: FC<IExplore> = ({ nftsExplore }) => {
    useEffect(() => console.log('nftsExplore', nftsExplore), [nftsExplore]);
  
    return (
    <>
      <Heading size="lg" marginBottom={6}>
        Explore the available NFTs
      </Heading>
      {nftsExplore?.length? (
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {nftsExplore.map((nft, key) => (
            <NFTExploreCard {...nft} key={key} />
          ))}
        </Grid>
      ) : (
        <Box>Looks Like there is no availabe NFT on the market</Box>
      )}
    </>
  );
};

export default Explore;