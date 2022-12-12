import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
  Button,
  SimpleGrid,
  HStack,
  VStack,
  Image,
  Text,
  Box,
  Badge,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { INFTExploreButton } from './types';

import { buyNft } from '@pages/api/nft/buyNft';
const NFTExploreButton: FC<INFTExploreButton> = ({ name, description, image, price, tokenId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const handleBuy = async () => {
    console.log('price', price);
    try {
      if (price) {
        const currentNft = {
          price,
          tokenId,
        };
        const res = await buyNft(currentNft);
        console.log(res);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <Center>
        <Button marginTop={2} alignItems="center" onClick={onOpen}>
          View
        </Button>
      </Center>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size={'4xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            NFT{'  '}
            <Badge fontWeight="bold" fontSize="20px" colorScheme={'green'}>
              #{tokenId}
            </Badge>
            : {name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} marginLeft={'5px'} marginRight={'5px'}>
              <VStack align={'left'}>
                <Text fontWeight={'bold'}>Description: </Text>

                <Text fontWeight={'normal'} fontSize={'20px'}> &quot;{`${description}`}&quot; </Text>
              </VStack>

              <Box maxWidth="500px" maxHeight="500px" overflow={'hidden'}>
                <Image src={`${image}`} alt={'nft'} minWidth={"400px"} minHeight={"400px"} boxSize="100%" objectFit="contain" />
              </Box>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter gap={'5px'}>
            <HStack gap={"1px"}>
              <Image src={`/weiLogo.png`} alt={'wei'} boxSize="10%" objectFit="contain" />
              <Text as="span" fontWeight={'bold'} fontSize={"30px"}>
                {' '}
                {price}
              </Text>
            </HStack>
            <Button
              colorScheme="green"
              mr={3}
              onClick={async () => {
                await handleBuy();
              }}
            >
              Buy
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NFTExploreButton;
