import { Component, OnInit } from '@angular/core';
import { SharingDataService } from '../../services/sharing-data.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../../models/cartItem';
import { ItemState } from '../../store/items.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-only-product',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './only-product.component.html',
  styleUrl: './only-product.component.css'
})
export class OnlyProductComponent implements OnInit{

  selectedId = 0;

  products: Product[] = [];
  producto: Product | undefined;
  show = false;
  qcompras = 1;
  items: Item[] = [];
  item!: Item | undefined;

  constructor(private sharingDataService: SharingDataService,
    private store: Store<{items: ItemState}>
  ){
    this.store.select('items').subscribe(state => {
      this.items = state.items;
    })
  }

  ngOnInit(): void {
    this.products = JSON.parse(sessionStorage.getItem('products') || '[]');
    this.selectedId =  JSON.parse(sessionStorage.getItem('selectProduct') || '0');
    this.sharingDataService.getProduct.subscribe(products => {
      this.products = products
      console.log(this.products);
      this.sortProducts();
      console.log(this.products);
      this.selectedId = this.products[0].id;
      this.saveSession();
    })
  }

  saveSession(): void{
    sessionStorage.setItem('products', JSON.stringify(this.products));
    sessionStorage.setItem('selectProduct', JSON.stringify(this.selectedId));
  }

  showSend(): void{
    this.show = !this.show
  }

  selected(id:number){
    this.selectedId = id;
  }
  addCart(): void{
    this.producto = this.products.find(products => products.id == this.selectedId)
    this.item = this.items.find(item => item.product.id == this.producto?.id)
    if(this.producto){
      if(this.item){
        this.qcompras = (this.item.quantity + this.qcompras);
        this.sharingDataService.productEventEmitter.emit({product: this.producto, qcompras: this.qcompras});
        this.qcompras = 1;
        
      } else{
        this.sharingDataService.productEventEmitter.emit({product: this.producto, qcompras:this.qcompras});

      }
    }
    this.openCart();
  }
  openCart(): void{
    this.sharingDataService.openEventEmitter.emit();
  }

  sortProducts():void{
   this.products = this.products.sort((a,b) => a.price - b.price);
  }
}
