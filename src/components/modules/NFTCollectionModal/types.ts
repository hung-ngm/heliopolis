import { TNFTExplore } from 'components/templates/marketplace/Explore/types';
export interface INFTCollectionModal extends Pick<TNFTExplore, 'name' | 'description' | 'image' | 'tokenId'> {
  isOpen: boolean;
  onClose: () => void;
}
