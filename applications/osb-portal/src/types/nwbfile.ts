import { FeaturedType } from './global'

// NWB File object
export interface NWBFile {
    id: number;
    name: string;
    description: string;
    image: string;
    type: FeaturedType;
}
