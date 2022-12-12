/* eslint-disable @typescript-eslint/no-empty-interface */
import { TNFTExplore } from 'components/templates/marketplace/Explore/types';

export interface INFTExploreButton extends Pick<TNFTExplore, 'price' | 'tokenId'> {}
