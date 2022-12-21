import { TNFTExplore } from 'components/templates/marketplace/types';
export interface INFTCollectionModal extends Pick<TNFTExplore, 'name' | 'description' | 'image' | 'tokenId' | 'itemId'> {
  isOpen: boolean;
  onClose: () => void;
}
