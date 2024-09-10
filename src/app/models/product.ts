export class Product{
    id!: number;
    name!: string;
    category!: string;
    subcategory!: string;
    price!: number;
    quantity!: number;
    description!: string;
    imagen!: string | null;
    categoryPriority?: number;
    medida!: string;
}
