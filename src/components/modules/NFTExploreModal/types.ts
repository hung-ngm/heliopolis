import { TNFTExplore } from "components/templates/marketplace/Explore/types";
export interface INFTExploreModal extends Pick<TNFTExplore, "name" | "description" | "image" | "price" | "tokenId"> {
  isOpen: boolean;
  onClose: () => void;
};