import { createReducer, on } from "@ngrx/store";
import { Item } from "../models/cartItem";
import { add, moreTotal, remove, total } from "./items.actions";


export interface ItemState{
    items: Item[];
    total: number;
    itemTotal: number;
}

export const initialState: ItemState = {
    items: JSON.parse(sessionStorage.getItem('cart') || '[]'),
    total: 0,
    itemTotal: 0,
}

export const itemReducer = createReducer(
    initialState,
    on(add, (state,{product, qcompras}) => {
        const hasItem = state.items.find(item => item.product.id === product.id);
      if (hasItem) {
          return {
              items: state.items.map(item => {
                if (item.product.id === product.id) {
                  return {
                    ...item,
                    quantity: qcompras
                  }
                }
                return item;
              }),
              total: state.total,
              itemTotal: state.itemTotal} 
            
      } else {
        return {items: [... state.items, { product: { ...product }, quantity: qcompras }],
    total: state.total,
    itemTotal: state.itemTotal};
      }
    }),
    on(remove,(state,{id}) => {
        return{
            items: state.items.filter(item => item.product.id !== id),
            total: state.total,
            itemTotal: state.itemTotal

        }
    }),
    on(total, state => {
        return{
            items: state.items,
            total: state.items.reduce((accumulator, item) => accumulator + item.quantity * item.product.price, 0),
            itemTotal: state.items.reduce((accumulator, item) => accumulator + item.quantity, 0)


        }
    }),
    on(moreTotal,(state,{payload}) => {
        return{
            items: state.items.map(item => {
                if (item.product.id === payload[1]) {
                  if (payload[0] > 0) {
                    return {
                      ...item,
                      quantity: item.quantity + 1
                    };
                  } else if (payload[0] < 0 && item.quantity > 1) {
                    return {
                      ...item,
                      quantity: item.quantity - 1
                    };
                  }
                }
                return item;
              }),
              total: state.total,
              itemTotal: state.itemTotal 
        }
    })
)