import { FeaturedType } from "./global";
import { Workspace } from "./workspace";

// Model object
export interface Model {
  id: number;
  name: string;
  description: string;
  image: string;
  type: FeaturedType;
}

export interface Page<T> {
  items: T[];
  totalPages: number;
  total: number;
}
