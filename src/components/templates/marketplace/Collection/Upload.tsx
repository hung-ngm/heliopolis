/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-alert */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-template */
import React from 'react';
import { create, CID, IPFSHTTPClient } from 'ipfs-http-client';
import { Button, Center, Image, Spinner, Icon, Box } from '@chakra-ui/react';
import { MdReceipt } from 'react-icons/md';

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const authorization = 'Basic ' + btoa(projectId + ':' + projectSecret);

type Props = {
  parent_image: string;
  parent_setImage: (val: string) => void;
  parent_closeModal: () => void;
  setIsImageOn: React.Dispatch<React.SetStateAction<boolean>>;
  isImageOn: boolean;
};

const Upload: React.FC<Props> = ({ parent_image, parent_setImage, parent_closeModal, setIsImageOn, isImageOn }) => {
  const [images, setImages] = React.useState<{ cid: CID; path: string }[]>([]);
  const [uploaded, setUploaded] = React.useState(false);

  // IPFS client
  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = create({
      url: 'https://ipfs.infura.io:5001/api/v0',
      headers: {
        authorization,
      },
    });
  } catch (error) {
    console.error('IPFS error ', error);
    ipfs = undefined;
  }

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
  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const files = (form[0] as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return alert('No files selected');
    }
    parent_setImage('loading...');
    const file = files[0];
    try {
      // upload files
      const result = await (ipfs as IPFSHTTPClient).add(file);

      const uniquePaths : any = new Set([...images.map((image) => image.path), result.path]);
      
      const uniqueImages = [...uniquePaths.values()].map((path) => {
        return [
          ...images,
          {
            cid: result.cid,
            path: result.path,
          },
        ].find((image) => image.path === path);
      });
      console.log('https://infura-ipfs.io/ipfs/' + uniqueImages[uniqueImages.length - 1]!.path);
      parent_setImage('https://infura-ipfs.io/ipfs/' + uniqueImages[uniqueImages.length - 1]!.path);
      setUploaded(true);
      form.reset();
    } catch (error) {
      parent_setImage('');
      form.reset();
    }
  };

  return (
    <div>
      {ipfs && (
        <>
          <Center>
            {!uploaded ? (
              <form onSubmit={onSubmitHandler}>
                <input name="file" type="file" />
                <Button type="submit">Upload File</Button>
              </form>
            ) : isImageOn ? (
              <Box>Image is ready!</Box>
            ) : (
              <Center>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              </Center>
            )}
          </Center>
          <br />

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
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              )
            ) : (
              <Icon as={MdReceipt} w={6} h={6} />
            )}
          </Center>
        </>
      )}

      {!ipfs && <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>}
    </div>
  );
};

export default Upload;
