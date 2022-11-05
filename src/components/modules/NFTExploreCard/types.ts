/* eslint-disable @typescript-eslint/no-empty-interface */
import { TNFTExplore } from "components/templates/marketplace/Explore/types";

export interface INFTExploreCard
    extends Pick<TNFTExplore, "name" | "description" | "image" | "price"> {}