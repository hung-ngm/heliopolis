import { Box, Image, SimpleGrid, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { FC } from 'react';
import { INFTExploreCard } from './types';
import { Button } from '@chakra-ui/react'
import { Center} from '@chakra-ui/react'
import {buyNft} from '@pages/api/nft/buyNft'
const NFTExploreCard: FC<INFTExploreCard> = ({ name, description, image, price, tokenId }) => {
  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  
  const handleBuy = async () => {
    console.log('price', price);
    // Set the nft for the buyNft function
    try{
      if (price) {
        const currentNft = {
          price,
          tokenId,
        }
        const res = await buyNft(currentNft);
        console.log(res);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (e: any){
      console.log(e);
    }
  }

  return (
    <Box maxWidth="315px" bgColor={bgColor} padding={3} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
      <Box maxHeight="260px" overflow={'hidden'} borderRadius="xl">
        <Image
          src={`${image}`}
          alt={'nft'}
          minH="260px"
          minW="260px"
          boxSize="100%"
          objectFit="fill"
        />
      </Box>
      <SimpleGrid columns={2} spacing={4}  padding={2.5} borderRadius="xl" marginTop={2}>

          <Center>
            <Tooltip label = {name}>
              <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2}>
                {name}
              </Box>
            </Tooltip>         
          </Center>
          <Center>
            <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2}>
              #{tokenId}
            </Box>
          </Center>
          
        
      </SimpleGrid>
      <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
        <Box>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
            Description
          </Box>
          <Tooltip label = {description}>
            <Box as="h4" noOfLines={1} fontSize="sm">
              {description}
            </Box>
          </Tooltip>
          
        </Box>
        <Box>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
            Price
          </Box>
          <Box as="h4" noOfLines={1} fontSize="sm">
            {price} Wei
          </Box>
        </Box>
      </SimpleGrid>
      <Center>
        <Button marginTop={2} alignItems="center" onClick={async () => {
          await handleBuy();
        }}>
          Buy
        </Button>
      </Center>
    </Box>
  );
};

export default NFTExploreCard;