import { Item } from "./cartItem";
import { Client } from "./client";

export class Cotizacion{
    cliente!: Client;
    cartItems!: Item[];
    total!: number;

}