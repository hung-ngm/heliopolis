import { Box, Container, Flex, HStack, Center, useColorModeValue } from '@chakra-ui/react';
import { Logo, NavBar } from 'components/elements';
import { ConnectButton } from '../ConnectButton';

const Header = () => {
  const borderColor = useColorModeValue('gray.800', 'white');
  return (
    <Center>
      <Box marginTop={3} borderWidth={2} borderRadius={30} borderColor={borderColor} width={'80%'}>
        <Container maxW="container.xl" p={'10px'}>
          <Flex align="center" justify="space-between">
            <Logo />
            <NavBar />
            <HStack gap={'10px'}>
              <ConnectButton />
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Center>
  );
};

export default Header;
