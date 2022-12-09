/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
import { Box, SimpleGrid, useColorModeValue, Tooltip, Center, Badge, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { INFTCollectionCardInfo } from './types';
import React from 'react';

const NFTCollectionCardInfo: FC<INFTCollectionCardInfo> = ({ name, description, tokenId }) => {
  const descBgColor = useColorModeValue('white', 'gray.900');
  return (
    <Box>
      <SimpleGrid columns={2} spacing={4} padding={2.5} bgColor={descBgColor}>
        <Box>
          <Tooltip label={description}>
            <Box fontWeight="semibold" noOfLines={1} marginTop={2}>
              <Text> {name} </Text>
            </Box>
          </Tooltip>
          <Box color={descBgColor}>
            _
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

export default NFTCollectionCardInfo;
