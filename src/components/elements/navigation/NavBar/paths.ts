import { ISubNav } from '../SubNav/SubNav';

const NAV_LINKS: ISubNav[] = [
  { label: 'Home', href: '/' },
  {
    label:"Chat",
    href:'/chat'
  },
  {
    label: 'Marketplace',
    href: '/marketplace',
    children: [
      {
        label: 'Explore',
        subLabel: 'Explore the NFT marketplace',
        href: '/marketplace/explore',
        logo: 'pack',
      },
      {
        label: 'Your collection',
        subLabel: 'Manage your NFT collection',
        href: '/marketplace/collection',
        logo: 'lazyNft',
      }
    ]
  },
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
        logo: 'lazyNft',
      }
    ]
  }
];

export default NAV_LINKS;
