import { Component, OnInit } from '@angular/core';
import { SharingDataService } from '../../services/sharing-data.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../../models/cartItem';
import { ItemState } from '../../store/items.reducers';
import { Store } from '@ngrx/store';
import { LoaderComponent } from '../loader/loader.component';
import { ProductService } from '../../services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-only-product',
  standalone: true,
  imports: [ CommonModule, FormsModule, LoaderComponent,RouterModule],
  templateUrl: './only-product.component.html',
  styleUrl: './only-product.component.css'
})
export class OnlyProductComponent implements OnInit{

  selectedId = 0;
  productos: Product[] = [];
  products: Product[] = [];
  producto: Product | undefined;
  show = false;
  qcompras = 1;
  items: Item[] = [];
  item!: Item | undefined;
  isLoading = true;

  constructor(private sharingDataService: SharingDataService,
    private store: Store<{items: ItemState}>, private service: ProductService
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
      console.log(this.productos);
      this.selectedId = this.products[0].id;
      this.saveSession();
      window.scrollTo(1, 1);
    });
    this.service.getProducts().subscribe(products => {
      this.productos = products;
      this.isLoading = false;
      console.log(this.productos)
    });
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
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  getMaxMin(name: string, category: string, subcategory:string): { min: number, max: number }{
    const hola = this.productos.filter(product => product.name === name);
    const prices = hola.map(precio => precio.price)
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
  getProduct(name: string): void{
    this.service.search(name).subscribe(product =>{
      this.sharingDataService.getProduct.emit(product);
    })
  }
}
