export class Product{
    id!: number;
    name!: string;
    category!: string;
    subcategory!: string;
    price!: number;
    precioOferta?: number | null;
    quantity!: number;
    description!: string;
    imagen!: string | null;
    categoryPriority?: number;
    medida!: string;
    relacion!: string;
}
