import { Box, Link, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const links = {
  github: 'https://github.com/minhhung123/heliopolis',
  forum: 'https://pitch.com/public/f3786a55-7ec7-4fcf-899d-d383c356eb9c/ef0eff9d-a90e-4a77-9a01-d4aaa0370bbb',
};

const Footer = () => {
  return (
    <Box textAlign={'center'} w="full" p={6}>
      <Text>
        From Hung, Harry and Hieu
      </Text>
      <Text>
        ⭐️ Please star this{' '}
        <Link href={links.github} isExternal alignItems={'center'}>
          boilerplate <ExternalLinkIcon />
        </Link>
        , every star makes us very happy!
      </Text>
      <Text>
        🙋 You need help? Refer to this {' '}
        <Link href={links.forum} isExternal alignItems={'center'}>
          link <ExternalLinkIcon />
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
