/* eslint-disable @typescript-eslint/no-empty-interface */
import { TNFTExplore } from "components/templates/marketplace/types";

export interface INFTExploreCard
    extends Pick<TNFTExplore, "name" | "description" | "image" | "price" | "tokenId"> {}