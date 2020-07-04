import { FeaturedType, OSBApplication } from './global'

// Workspace object
export interface Workspace {
    
    id: string;
    name: string;
    description: string;
    image: string;
    owner: string; // User id
    lastEdited: string;
    lastEditedUserId: string;
    shareType: FeaturedType;
    types: OSBApplication[];
    lastApplicationEdit: OSBApplication;
    volume: string; // Volume id
}
