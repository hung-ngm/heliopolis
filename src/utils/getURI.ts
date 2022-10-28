import { TokenUri } from '../components/templates/marketplace/Explore/types';

export const getURI = (uri: string): TokenUri => {
    return JSON.parse(uri);
};