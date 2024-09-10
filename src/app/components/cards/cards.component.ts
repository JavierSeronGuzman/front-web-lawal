import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartComponent } from '../cart/cart.component';
import { SharingDataService } from '../../services/sharing-data.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CartComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit{

  products!: Product[];

  constructor(private service: ProductService,
    private sharingDataService: SharingDataService,
    private store: Store<{products: any}>
  ){
  }

  ngOnInit(): void {
    this.service.getProducts().subscribe(products => this.products = products
    );
    console.log(this.products)

  }
  
  // addCart(product: Product): void{
  //   this.sharingDataService.productEventEmitter.emit(product);
    
  // }
  onCloseCart(): void{
    this.sharingDataService.openEventEmitter.emit();
  }
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
}
