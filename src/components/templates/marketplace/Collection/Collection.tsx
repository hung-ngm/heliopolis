import { Box, Grid, Heading } from '@chakra-ui/react';
import { NFTCollectionCard } from 'components/modules';
import React, { FC, useEffect } from 'react';
import { ICollection } from './types';

const Collection: FC<ICollection> = ({ myNfts }) => {
    useEffect(() => console.log('myNfts', myNfts), [myNfts]);
  
    return (
    <>
      <Heading size="lg" marginBottom={6}>
        This is your NFT collection
      </Heading>
      {myNfts?.length? (
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {myNfts.map((nft, key) => (
            <NFTCollectionCard {...nft} key={key} />
          ))}
        </Grid>
      ) : (
        <Box>Looks Like there you have no NFTs right now</Box>
      )}
    </>
  );
};

export default Collection;