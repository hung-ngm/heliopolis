import { useDisclosure, Center, Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import { INFTExploreButton } from './types';
import { NFTExploreModal } from '../NFTExploreModal';

const NFTExploreButton: FC<INFTExploreButton> = ({ name, description, image, price, tokenId, itemId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalProps = { name, description, image, price, tokenId, isOpen, onClose, itemId };

  return (
    <>
      <Center>
        <Button marginTop={2} alignItems="center" onClick={onOpen} colorScheme="teal">
          View
        </Button>
      </Center>
      <NFTExploreModal {...modalProps} />
    </>
  );
};

export default NFTExploreButton;
