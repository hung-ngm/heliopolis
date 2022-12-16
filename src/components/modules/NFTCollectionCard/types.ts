/* eslint-disable @typescript-eslint/no-empty-interface */
import { TNFTCollection } from "components/templates/collection/types";

export interface INFTCollectionCard
    extends Pick<TNFTCollection, "name" | "description" | "image" | "tokenId"> {}