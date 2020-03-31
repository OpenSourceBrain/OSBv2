import { FeaturedType } from './global'

// Workspace object
export interface Workspace {
    id: number;
    name: string;
    description: string;
    image: string;
    ownerId: number;
    lastEdited: string;
    lastEditedUserId: number;
    type: FeaturedType;
}
