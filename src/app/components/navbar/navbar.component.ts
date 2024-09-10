import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../models/cartItem';
import { CategoriasComponent } from '../categorias/categorias.component';
import { RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { Store } from '@ngrx/store';
import { ItemState } from '../../store/items.reducers';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CategoriasComponent,RouterModule, FormsModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit{

  searchTerm: string = '';
  itemTotal!: number;
  items: Item[] = [];
  products: Product[] = [];
  name!: string;

  constructor(private sharingDataService: SharingDataService,private service: ProductService,
    private store: Store<{items: ItemState}>
  ){
    this.store.select('items').subscribe( state => {
      this.itemTotal = state.itemTotal;
      this.items = state.items;
    })
  }
  ngOnInit(): void {
    this.search();
  }

  openCart(): void{
    this.sharingDataService.openEventEmitter.emit();
  }
  scrollMap():void{
    this.sharingDataService.scrollMapEventEmitter.emit();
  }

  home(): void{
    this.sharingDataService.homeEventEmitter.emit();
  }
  searchProducts(): void {
    if (this.searchTerm.trim()) {
     this.sharingDataService.searchEventEmitter.emit(this.searchTerm);
     this.searchTerm = '';
    } else{
      this.sharingDataService.subEventEmitter.emit(['todo','todo']);
    }
  }
  search(): void {
    this.sharingDataService.searchEventEmitter.subscribe(name => {
      this.name = name;
      this.service.search(name).subscribe(
        (products: Product[] | null) => {
          if (products && products.length > 0) {
            this.products = products;
            this.sharingDataService.subEventEmitter.emit([this.products[0].category, 'todo']);
          } else {
            // Escribir 'Hola' en la consola si products es null o está vacío
            this.sharingDataService.subEventEmitter.emit(['todo', 'todo']);
          }
        },
        (error) => {
          // Manejo de errores
          console.error('Error fetching products:', error);
        }
      );
    });
  }
  
}
