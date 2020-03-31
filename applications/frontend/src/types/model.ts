import { FeaturedType } from './global'

// Model object
export interface Model {
    id: number;
    name: string;
    description: string;
    image: string;
    type: FeaturedType;
}
