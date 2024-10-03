import {Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CartModalComponent } from './cart-modal/cart-modal.component';
import { Item } from '../models/cartItem';
import { ProductService } from '../services/product.service';
import { SharingDataService } from '../services/sharing-data.service';
import { Store } from '@ngrx/store';
import { ItemState } from '../store/items.reducers';
import { add, moreTotal, remove, total } from '../store/items.actions';
import { AboutusComponent } from './aboutus/aboutus.component';
import { MapComponent } from './map/map.component';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,CartModalComponent,FooterComponent,AboutusComponent,MapComponent
  ],
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit {
  title = 'lawal';
  showCart = false;

  items: Item[] = [];

  total!:number;

  itemTotal!:number;

  isLoading!: boolean;

  constructor(private service: ProductService,
    private store: Store<{items: ItemState}>,
      private sharingDataService: SharingDataService,
  ){
    this.store.select('items').subscribe(state => {
      this.items = state.items;
      this.total = state.total;
      this.itemTotal = state.itemTotal;
      this.saveSession();
    });

  }

  ngOnInit(): void {
    this.store.dispatch(total());
    this.delCart();
    this.addCart();
    this.openCloseCart();
    // this.moreTotal();
  }

  openCloseCart(): void{
    this.sharingDataService.openEventEmitter.subscribe(()=>{
      this.showCart = !this.showCart;
    });
  }
  addCart(): void{
    this.sharingDataService.productEventEmitter.subscribe(product => {
      this.store.dispatch(add(product));
      this.store.dispatch(total());
    });
  }
  delCart(): void{
    this.sharingDataService.idProductEventEmitter.subscribe(id =>{
      if (this.items.length == 0) {
        sessionStorage.removeItem('cart');
        sessionStorage.clear();
      }
      this.store.dispatch(remove({id}));
      this.store.dispatch(total());
    });
  }

  // moreTotal(): void{
  //   this.sharingDataService.moreTotalEventEmitter.subscribe((qcompras) => {
  //     const hasItem = this.items.find(item => item.product.id === payload[1]);
  //     if (hasItem) {
  //       this.store.dispatch(moreTotal({payload}));
  //     }
  
  //     this.store.dispatch(total());
  //   });
  // }
  saveSession(): void{
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }
  

}
