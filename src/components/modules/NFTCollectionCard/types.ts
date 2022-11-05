import { TNFTCollection } from "components/templates/marketplace/Collection/types";

export interface INFTCollectionCard
    extends Pick<TNFTCollection, "name" | "description" | "image" | "tokenId"> {}