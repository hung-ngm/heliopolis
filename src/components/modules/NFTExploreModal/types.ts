import { TNFTExplore } from "components/templates/marketplace/types";
export interface INFTExploreModal extends Pick<TNFTExplore, "name" | "description" | "image" | "price" | "tokenId" | "itemId"> {
  isOpen: boolean;
  onClose: () => void;
};