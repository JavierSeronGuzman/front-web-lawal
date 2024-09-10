import { Product } from "./product";

export interface GroupedProducts {
    [category: string]: {
        [subcategory: string]: Product[];
      };
  }