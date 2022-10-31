import { Box, Image, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { FC } from 'react';
import { INFTCollectionCard } from './types';

const NFTCollectionCard: FC<INFTCollectionCard> = ({ name, description, image }) => {
  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');

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
      <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2}>
        {name}
      </Box>
      <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
        <Box>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
            Description
          </Box>
          <Box as="h4" noOfLines={1} fontSize="sm">
            {description}
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default NFTCollectionCard;