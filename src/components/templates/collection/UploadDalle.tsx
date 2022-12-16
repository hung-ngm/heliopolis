/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-alert */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-template */
import React from 'react';
import { Center, Image, Spinner, Icon, Box } from '@chakra-ui/react';
import { MdReceipt } from 'react-icons/md';

type Props = {
  parentImage: string;
  parentSetImage: (val: string) => void;
  parentCloseModal: () => void;
  setIsImageOn: React.Dispatch<React.SetStateAction<boolean>>;
  isImageOn: boolean;
};

const DalleImage: React.FC<Props> = ({ parentImage, parentSetImage, parentCloseModal, setIsImageOn, isImageOn }) => {
  // Handler
  const handleErrorImage = async (event: any) => {
    parentSetImage(''); 
    alert('The upload image service is congested. Please try again later...');
    parentCloseModal();
  };

  const handleFinishLoad = async (event: any) => {
		setIsImageOn(true);
  };

  return (
    <div>
      <Center>
        {isImageOn ? (
          <Box>Image is ready!</Box>
        ) : (
          <Center>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Center>
        )}
      </Center>

      <Center>
        {parentImage !== '' ? (
          parentImage !== 'loading...' ? (
            <Image
              alt={'Upload image'}
              src={parentImage}
              boxSize="256px"
              onError={handleErrorImage as React.ReactEventHandler<HTMLImageElement>}
              onLoad={handleFinishLoad as React.ReactEventHandler<HTMLImageElement>}
              objectFit="contain"
            />
          ) : null
        ) : (
          <Icon as={MdReceipt} w={6} h={6} />
        )}
      </Center>
    </div>
  );
};

export default DalleImage;
