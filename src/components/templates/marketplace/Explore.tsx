import { Box, Grid, Heading, Image, Center, useColorModeValue } from '@chakra-ui/react';
import { NFTExploreCard } from 'components/modules';
import React, { FC } from 'react';
import { IExplore } from './types';

const Explore: FC<IExplore> = ({ nftsExplore }) => {
  const headerColor = useColorModeValue('black', 'white');
  return (
    <>
      <Center>
        <Heading size="xl" marginBottom={6} borderColor = {headerColor} padding={'10px'} borderRadius={10} borderWidth={5}>
          MARKETPLACE
        </Heading>
      </Center>

      {nftsExplore?.length ? (
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {nftsExplore.map((nft, key) => (
            <NFTExploreCard {...nft} key={key} />
          ))}
        </Grid>
      ) : (
        <>
          <Box>Look like there is nothing on the market at the moment.</Box>

          <br />
          <Center>
            <Image src="/empty_market.webp" alt="empty" />
          </Center>
        </>
      )}
    </>
  );
};

export default Explore;
