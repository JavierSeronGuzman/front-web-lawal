import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CardsComponent } from '../cards/cards.component';
import { BannerComponent } from '../banner/banner.component';
import { OfertasComponent } from '../ofertas/ofertas.component';
import { MapComponent } from '../map/map.component';
import { AboutusComponent } from '../aboutus/aboutus.component';
import { SharingDataService } from '../../services/sharing-data.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ProductStar } from '../../models/productStar';
import { GroupedProducts } from '../../models/groupedProducts';
import { ProductService } from '../../services/product.service';
import { GroupedProductsStar } from '../../models/groupedProductsStar';
import { Product } from '../../models/product';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet,BannerComponent,OfertasComponent,CardsComponent,AboutusComponent,MapComponent, CommonModule, RouterModule, LoaderComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{

  isLoading = true;

  products: Product[] = [];
  groupedProducts: GroupedProducts= {};
  @ViewChild('productRow') productRow!: ElementRef;
  @ViewChild('dotsContainer') dotsContainer!: ElementRef;

  constructor(private service: ProductService,private sharingDataService: SharingDataService,
    private router: Router, private viewportScroller: ViewportScroller
  ){}
  ngOnInit(): void {
    this.service.getProducts().subscribe(products =>{
      this.products = products;
      this.group();
      this.isLoading = false;
    })
        // Scroll al inicio cuando la aplicación carga o la página se refresca
    window.scrollTo(1, 1);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }});
    this.scrollToMap();
    this.home();
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
  
    // Ordenar los productos de la categoría "Madera" por el patrón NxM
    if (orderedGroupedProducts['Madera']) {
      Object.keys(orderedGroupedProducts['Madera']).forEach(subcategory => {
        orderedGroupedProducts['Madera'][subcategory] = orderedGroupedProducts['Madera'][subcategory].sort((a, b) => {
          // Extraer los números antes y después de la "x"
          const [aFirst, aSecond] = a.name.split('x').map(Number);
          const [bFirst, bSecond] = b.name.split('x').map(Number);
  
          // Primero ordenar por el número antes de la "x", luego por el número después de la "x"
          if (aFirst === bFirst) {
            return aSecond - bSecond;
          }
          return aFirst - bFirst;
        });
      });
    }
  
    this.groupedProducts = orderedGroupedProducts;
  }
  

  getCategoryKeys(): string[] {
    return Object.keys(this.groupedProducts);
  }
  getSubcategoryKeys(category: string): string[] {
    return Object.keys(this.groupedProducts[category] || {});
  }
  getProductGroups(category: string, subcategory: string): any[][] {
    const products = this.groupedProducts[category][subcategory];
    const productGroups = [];
    for (let i = 0; i < products.length; i += 5) {
      productGroups.push(products.slice(i, i + 5));
    }
    console.log(productGroups)
    return productGroups;
    
  }


  scrollToMap(): void{
    this.sharingDataService.scrollMapEventEmitter.subscribe(() =>{
      
      const mapElement = document.getElementById("map");
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    })
  }

  home(): void{
    this.sharingDataService.homeEventEmitter.subscribe(() => {
      window.scrollTo(1, 1);
    })
  }
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
