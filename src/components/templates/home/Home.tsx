import { CheckCircleIcon, SettingsIcon, SpinnerIcon } from '@chakra-ui/icons';
import { Heading, VStack, List, ListIcon, ListItem } from '@chakra-ui/react';

const Home = () => {
  return (
    <VStack w={'full'}>
      <Heading size="md" marginBottom={6}>
        Features
      </Heading>  
      <List spacing={3}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Buy/Sell NFT tokens
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Mint by AI
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Mint by uploading local images
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Chat
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Transfer ERC20/NFT
        </ListItem>
        <ListItem>
          <ListIcon as={SpinnerIcon} color="green.500" />
          NFT-gated chate
        </ListItem>
        <ListItem>
          <ListIcon as={SpinnerIcon} color="green.500" />
          More powerful AI
        </ListItem>
        <ListItem>
          <ListIcon as={SpinnerIcon} color="green.500" />
          Support more blockchain
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          Multichain Support
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          Frontend: NextJS, Typescript, Chakra UI
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          Blockchain: Polygon, Goerli, Moralis, IPFS, Infura, Axelar...
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          Chat: XMTP Protocol
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          API: Moralis, Open AI DALL-E API
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          ... and more
        </ListItem>
      </List>
    </VStack>
  );
};

export default Home;
