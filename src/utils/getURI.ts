import { TokenUri } from '../components/templates/marketplace/types';

export const getURI = (uri: string): TokenUri => {
    return JSON.parse(uri);
};