import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { SharingDataService } from '../services/sharing-data.service';
import { CommonModule, NgClass, ViewportScroller } from '@angular/common';
import { GroupedProducts } from '../models/groupedProducts';
import { AboutusComponent } from './aboutus/aboutus.component';
import { MapComponent } from './map/map.component';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule,AboutusComponent,MapComponent, RouterModule, LoaderComponent],
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit{

  products: Product[] = [];
  groupedProducts: GroupedProducts= {};
  subcategoryToScroll!: string[];  
  productos: Product[] = [];
  isLoading = true;

  constructor(
    private service: ProductService,
    private sharingDataService: SharingDataService,private router: Router,private viewportScroller: ViewportScroller
  ){}
  

  ngOnInit(): void {
    this.service.getProducts().subscribe(products => {
      this.products = products;
      this.group();
      this.isLoading = false;
    });
    // Scroll al inicio cuando la aplicación carga o la página se refresca
    window.scrollTo(1, 1);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
           }});
    this.subcategoryToScroll = JSON.parse(sessionStorage.getItem('cat') || '["todo","todo"]')
    this.sub();
  }

  group() {
    // Objeto para almacenar los productos agrupados
    this.groupedProducts = this.products.reduce<GroupedProducts>((acumulador, product) => {
      if (!acumulador[product.category]) {
        acumulador[product.category] = {};
      }
  
      if (!acumulador[product.category][product.subcategory]) {
        acumulador[product.category][product.subcategory] = [];
      }
  
      // Crear un conjunto para rastrear nombres de productos ya añadidos en la categoría y subcategoría
      const addedProductNames = new Set(acumulador[product.category][product.subcategory].map(p => p.name));
  
      // Solo agregar el producto si su nombre no está en el conjunto
      if (!addedProductNames.has(product.name)) {
        acumulador[product.category][product.subcategory].push(product);
      }
  
      return acumulador;
    }, {});
  
    // Ordenar las categorías por prioridad usando `categoryPriority`
    const orderedGroupedProducts: GroupedProducts = Object.keys(this.groupedProducts)
      .sort((a, b) => {
        const priorityA = this.products.find(p => p.category === a)?.categoryPriority!;
        const priorityB = this.products.find(p => p.category === b)?.categoryPriority!;
        return priorityA - priorityB;
      })
      .reduce((obj, key) => {
        obj[key] = this.groupedProducts[key];
        return obj;
      }, {} as GroupedProducts);
  
    this.groupedProducts = orderedGroupedProducts;
    console.log(this.groupedProducts)
  
  }
  

  getCategoryKeys(): string[] {
    return Object.keys(this.groupedProducts);
  }
  getSubcategoryKeys(category: string): string[] {
    return Object.keys(this.groupedProducts[category] || {});
  }

  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  sub(): void {
    this.sharingDataService.subEventEmitter.subscribe((subcategory: string[]) => {
      window.scrollTo(1, 1);
      this.subcategoryToScroll = subcategory
      this.saveSession();
      
    });
  }
  saveSession(): void{
    sessionStorage.setItem('cat', JSON.stringify(this.subcategoryToScroll));
  }

  getProduct(name: string): void{
    this.service.search(name).subscribe(product =>{
      this.sharingDataService.getProduct.emit(product);
    })
  }

  getMaxMin(name: string, category: string, subcategory:string): { min: number, max: number }{
    const hola = this.products.filter(product => product.name === name);
    const prices = hola.map(precio => precio.price)
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  

}
