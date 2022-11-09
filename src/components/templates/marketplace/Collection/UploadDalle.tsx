/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-alert */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-template */
import React from 'react';
import {Center, Image, Spinner, Icon, Box } from '@chakra-ui/react';
import { MdReceipt } from 'react-icons/md';

type Props = {
  parent_image: string;
  parent_setImage: (val: string) => void;
  parent_closeModal: () => void;
  setIsImageOn: React.Dispatch<React.SetStateAction<boolean>>;
  isImageOn: boolean;
};

const DalleImage: React.FC<Props> = ({ parent_image, parent_setImage, parent_closeModal, setIsImageOn, isImageOn }) => {
  // Handler
  const handleErrorImage = async (event: any) => {
    parent_setImage('');
    alert('The upload image service is congested. Please try again later...');
    parent_closeModal();
    console.log(event);
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
          {parent_image !== '' ? (
            parent_image !== 'loading...' ? (
              <Image
                alt={'Upload image'}
                src={parent_image}
                boxSize="256px"
                onError={handleErrorImage as React.ReactEventHandler<HTMLImageElement>}
                onLoad={handleFinishLoad as React.ReactEventHandler<HTMLImageElement>}
                objectFit="contain"
              />
            ) : (
              null
            )
          ) : (
            <Icon as={MdReceipt} w={6} h={6} />
          )}
        </Center>

    </div>
  );
};

export default DalleImage;
