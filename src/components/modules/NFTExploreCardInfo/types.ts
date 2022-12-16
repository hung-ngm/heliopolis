/* eslint-disable @typescript-eslint/no-empty-interface */
import { TNFTExplore } from "components/templates/marketplace/types";

export interface INFTExploreCardInfo
    extends Pick<TNFTExplore, "name" | "description" | "price" | "tokenId"> {}