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
  parent_image: string;
  parent_setImage: (val: string) => void;
  parent_closeModal: () => void;
  setIsImageOn: React.Dispatch<React.SetStateAction<boolean>>;
  isImageOn: boolean;
};

const DalleImage: React.FC<Props> = ({ parent_image, parent_setImage, parent_closeModal, setIsImageOn, isImageOn }) => {
  // Handler
  const handleErrorImage = async (event: any) => {
    /* Handler when the image cannot be loaded */
    parent_setImage(''); 
    alert('The upload image service is congested. Please try again later...');
    parent_closeModal();
  };

  const handleFinishLoad = async (event: any) => {
    /* Hanlder when the image is finished loading */
		setIsImageOn(true);
  };

  return (
    <div>
      {/* Image uploading status
       *	If image is not yet loaded, spinner
       *	Else prompt
       */}
      <Center>
        {isImageOn ? (
          <Box>Image is ready!</Box>
        ) : (
          <Center>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Center>
        )}
      </Center>

      {/* upload image space
        *	If there is image path
        *	*	If the image is being created by dalle: null (spinner is shown by above code)
        *	*	Else null
        *	Else
        * *	Show placeholder icon
        */}
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
          ) : null
        ) : (
          <Icon as={MdReceipt} w={6} h={6} />
        )}
      </Center>
    </div>
  );
};

export default DalleImage;
