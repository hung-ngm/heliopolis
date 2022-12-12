import { ISubNav } from '../SubNav/SubNav';

const NAV_LINKS: ISubNav[] = [
  { label: 'Marketplace', href: '/marketplace/explore' },
  { label: 'Your collection', href: '/marketplace/collection' },
  {
    label: 'Create',
    href: '/create',
    children: [
      {
        label: 'Manual Mint',
        subLabel: 'Create your own NFT',
        href: '/create/manual',
        logo: 'lazyNft',
      },
      {
        label: 'Dall-E Mint',
        subLabel: 'Use Dall-E to create your own NFT',
        href: '/create/dalle',
        logo: 'wizard',
      },
    ],
  },
  { label: 'Chat', href: '/chat' },
];

export default NAV_LINKS;
