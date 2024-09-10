import { Component} from '@angular/core';
import { Item } from '../../models/cartItem';
import { SharingDataService } from '../../services/sharing-data.service';
import { Store } from '@ngrx/store';
import { ItemState } from '../../store/items.reducers';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  items: Item[] = [];
  
  total = 0;
  hasItem: Item | undefined;

  constructor(private sharingDataService: SharingDataService,
    private store: Store<{items: ItemState}>
  ){
    this.store.select('items').subscribe(state => {
      this.items = state.items;
      this.total = state.total;
    })
  }
  addCart(id:number, qcompras:number): void{
    this.hasItem = this.items.find(item => item.product.id == id)
    console.log(qcompras);
    if(this.hasItem){
      this.sharingDataService.productEventEmitter.emit({product: this.hasItem.product, qcompras: qcompras});
    }
    console.log(this.hasItem?.quantity)
    
  }
  
  deleteCart(id: number):void{
    this.sharingDataService.idProductEventEmitter.emit(id);
  }
  // moreTotal(accion: number, id:number): void{
  //   const payload = [accion,id]
  //   this.sharingDataService.moreTotalEventEmitter.emit(payload);
  // }
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
