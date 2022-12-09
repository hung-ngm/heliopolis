/* eslint-disable @typescript-eslint/no-empty-interface */
import { TNFTCollection } from 'components/templates/marketplace/Collection/types';

export interface INFTCollectionCardInfo extends Pick<TNFTCollection, 'name' | 'description' | 'tokenId'> {}
