/* eslint-disable @typescript-eslint/no-empty-interface */
import { TNFTCollection } from 'components/templates/collection/types';

export interface INFTCollectionCardInfo extends Pick<TNFTCollection, 'name' | 'description' | 'tokenId'> {}
