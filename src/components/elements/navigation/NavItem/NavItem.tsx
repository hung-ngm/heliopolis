import { Box, Link, Popover, PopoverContent, PopoverTrigger, Stack, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FC } from 'react';
import { ISubNav } from '../SubNav/SubNav';
import { SubNav } from '../SubNav';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

// eslint-disable-next-line complexity
const NavItem: FC<ISubNav> = ({ label, children, href }) => {
  const linkColor = useColorModeValue('gray.900', 'gray.100');
  const linkActiveColor = useColorModeValue('white', 'white');

  const boxActiveColor = useColorModeValue('blue.400', 'blue');

  const boxHoverColor = useColorModeValue('blue.300', 'blue.300');
  const linkHoverColor = useColorModeValue('white', 'white');

  const router = useRouter();
  const isCurrentPath = router.asPath === href || (href !== '/' && router.pathname.startsWith(href || ''));

  return (
    <Popover trigger={'hover'} placement={'bottom-start'}>
      <PopoverTrigger>
        <Box>
          <Box
            borderRadius={20}
            borderWidth={isCurrentPath ? '1px' : 0}
            padding={'10px'}
            fontSize={20}
            fontWeight={500}
            backgroundColor={isCurrentPath ? boxActiveColor : ''}
            color={isCurrentPath ? linkActiveColor : linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
              bgColor: boxHoverColor,
            }}
            cursor="pointer"
          >
            {children ? (
              <>
                {label} <ChevronDownIcon />
              </>
            ) : (
              <NextLink href={href || '/'}>
                <Link
                  _hover={{
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              </NextLink>
            )}
          </Box>
        </Box>
      </PopoverTrigger>

      {children && (
        <PopoverContent border={0} boxShadow={'xl'} p={4} rounded={'xl'} minW={'sm'}>
          <Stack>
            {children.map((child) => (
              <SubNav key={child.label} {...child} />
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default NavItem;
