import { Box, Image, SimpleGrid, useColorModeValue, Tooltip, Badge, Text, HStack, Center } from '@chakra-ui/react';
import { FC } from 'react';
import { INFTExploreCardInfo } from './types';

const NFTExploreCardInfo: FC<INFTExploreCardInfo> = ({ name, description, price, tokenId }) => {
  const descBgColor = useColorModeValue('gray.100', 'gray.900');
  return (
    <Box>
      <SimpleGrid columns={2} spacing={4} padding={2.5} bgColor={descBgColor}>
        <Box>
          <Tooltip label={description}>
            <Box fontWeight="semibold" noOfLines={1} marginTop={2}>
              {name}
            </Box>
          </Tooltip>
          <Box fontWeight="bold" fontSize="xl">
            <HStack spacing="5px">
              <Image src={`/weiLogo.png`} alt={'wei'} boxSize="10%" objectFit="contain" />
              <Text as="span"> {price} </Text>
            </HStack>
          </Box>
        </Box>
        <Center>
          <Box>
            <Badge fontWeight="bold" fontSize="20px" colorScheme={'green'}>
              #{tokenId}
            </Badge>
          </Box>
        </Center>
      </SimpleGrid>
    </Box>
  );
};

export default NFTExploreCardInfo;
