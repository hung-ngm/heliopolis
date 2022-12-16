import React, { FC } from 'react';
import { INFTCollectionButton } from './types';
import { Button, Center, useDisclosure } from '@chakra-ui/react';

import { NFTCollectionModal } from '../NFTCollectionModal';

const NFTCollectionButton: FC<INFTCollectionButton> = ({ name, description, image, tokenId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const finalRef = React.useRef(null);
  const modalProps = { name, description, image, tokenId, isOpen, onClose };

  return (
    <Center>
      <Button marginTop={2} alignItems="center" onClick={onOpen} ref={finalRef} colorScheme="teal">
        Sell
      </Button>
      <NFTCollectionModal {...modalProps} />
    </Center>
  );
};

export default NFTCollectionButton;
