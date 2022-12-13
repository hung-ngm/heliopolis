import { Image, Box } from '@chakra-ui/react';
import { FC } from 'react';
import { INFTImage } from './types';

const NFTImage: FC<INFTImage> = ({ image }) => {
  return (
    <Box maxHeight="300px" overflow={'hidden'}>
      <Image src={`${image}`} alt={'nft'} minH="300px" minW="300px" boxSize="100%" objectFit="contain" _hover={{ transform: "scale(1.2)", }} transition={"0.2s ease-in-out"}/>
    </Box>
  );
};

export default NFTImage;
