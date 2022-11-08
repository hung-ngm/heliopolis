import { Box, Grid, Heading, Image, Spinner, Center } from '@chakra-ui/react';
import { NFTExploreCard } from 'components/modules';
import React, { FC, useEffect } from 'react';
import { IExplore } from './types';
import loading from '@public/loading.svg'
const Explore: FC<IExplore> = ({ nftsExplore, isInitialLoading }) => {
    useEffect(() => {
    }, [nftsExplore]);
    
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
        isInitialLoading ? (
          <Center>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />  
          </Center>
          
        ) : (
          <>
            <Box>Look like there is nothing on the market at the moment.</Box>

            <br/>
            <Center>
              <Image src={'/empty_market.webp'} />
            </Center>
          </>
          
        )
      )}
    </>
  );
};

export default Explore;