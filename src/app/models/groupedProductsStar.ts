import { Product } from "./product";
import { ProductStar } from "./productStar";

export interface GroupedProductsStar {
    [category: string]: {
        [subcategory: string]: ProductStar[];
      };
  }