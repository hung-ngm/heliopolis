/* eslint-disable @typescript-eslint/no-empty-interface */
import { TNFTCollection } from "components/templates/marketplace/Collection/types";

export interface INFTCollectionCard
    extends Pick<TNFTCollection, "name" | "description" | "image" | "tokenId"> {}