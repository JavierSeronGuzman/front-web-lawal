import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartComponent } from '../cart/cart.component';
import { Item } from '../../models/cartItem';
import { SharingDataService } from '../../services/sharing-data.service';
import { ItemState } from '../../store/items.reducers';
import { Store } from '@ngrx/store';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CartComponent,RouterModule],
  templateUrl: './cart-modal.component.html'
})
export class CartModalComponent {


  items: Item[] = [];
  total = 0;

  message!: String;



  constructor(private sharingDataService: SharingDataService,
    private store: Store<{items: ItemState}>
  ){
    this.store.select('items').subscribe(state => {
      this.items = state.items;
      this.total = state.total;

    })
  }

  closeCart(): void {
    this.sharingDataService.openEventEmitter.emit();
  }
  sendToWhatsApp() {
    const message = this.generateWhatsAppMessage();
    const whatsappURL = `https://web.whatsapp.com/send?phone=56967453739&text=${message}`;
    window.open(whatsappURL, '_blank');
  }
  generateWhatsAppMessage(): String {
    let message = 'Hola, quiero ver disponibilidad de los siguientes productos:\n';

    this.items.forEach(item => {
        message += `${item.quantity} x ${item.product.name} ${item.product.medida}($ ${this.formatPrice(item.product.price)}) \n`;
    });
    message += `Total: $ ${this.formatPrice(this.total)}`

    return encodeURIComponent(message);  // Codificar el mensaje para incluirlo en una URL
}
formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


}
