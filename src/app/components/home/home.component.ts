import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CardsComponent } from '../cards/cards.component';
import { BannerComponent } from '../banner/banner.component';
import { OfertasComponent } from '../ofertas/ofertas.component';
import { OfertasPrecioComponent } from '../ofertas-precio/ofertas-precio.component';
import { ProductCarouselComponent, CarouselCard } from '../product-carousel/product-carousel.component';
import { MapComponent } from '../map/map.component';
import { AboutusComponent } from '../aboutus/aboutus.component';
import { SharingDataService } from '../../services/sharing-data.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ProductStar } from '../../models/productStar';
import { GroupedProducts } from '../../models/groupedProducts';
import { ProductService } from '../../services/product.service';
import { GroupedProductsStar } from '../../models/groupedProductsStar';
import { Product } from '../../models/product';
import { Anuncios } from '../../models/anuncios';
import { CategoriaDestacada } from '../../models/categoriaDestacada';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet,BannerComponent,OfertasComponent,OfertasPrecioComponent,ProductCarouselComponent,CardsComponent,AboutusComponent,MapComponent, CommonModule, RouterModule, LoaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  cat1!: number;
  cat2!: number;
  cat3!: number;
  isLoading = true;
  productGroups: Product[][] = [];
  products: Product[] = [];
  madera: Product[] = [];
  tableros: Product[] = [];
  zinc: Product[] = [];
  groupedProducts: GroupedProducts= {};
  categoriasDestacadas: CategoriaDestacada[] = [];
  anuncios: Anuncios[] = [];
  stars: Product[] = [];
  ofertas: Product[] = [];
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
      this.sharingDataService.scrollEventEmitter.emit("");
    })
    this.service.getCategoriasDestacadas().subscribe(c => this.categoriasDestacadas = c);
    this.service.getAnuncios().subscribe(a => this.anuncios = a);
    this.service.getProductsStars().subscribe(s => this.stars = s);
    this.service.getOfertas().subscribe(o => this.ofertas = o);
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
          // Verificar si el nombre del producto contiene "x"
          if (a.name.includes('x') && b.name.includes('x')) {
            const [aFirst, aSecond] = a.name.split('x').map(Number);
            const [bFirst, bSecond] = b.name.split('x').map(Number);
  
            // Primero ordenar por el número antes de la "x", luego por el número después de la "x"
            if (aFirst === bFirst) {
              return aSecond - bSecond;
            }
            return aFirst - bFirst;
          } else {
            // Si no contienen "x", mantener el orden original
            return 0;
          }
        });
      });
    }
  
    // Asignar el grupo de productos ordenados
    this.groupedProducts = orderedGroupedProducts;
    this.getProductGroups();

  }
  
  

  getCategoryKeys(): string[] {
    return Object.keys(this.groupedProducts);
  }
  getSubcategoryKeys(category: string): string[] {
    return Object.keys(this.groupedProducts[category] || {});
  }
  getProductGroups() {
       // Preparar el arreglo de `productGroups` dividiendo los productos en grupos de 5
       Object.keys(this.groupedProducts).forEach(category => {
        Object.keys(this.groupedProducts[category]).forEach(subcategory => {
          const products = this.groupedProducts[category][subcategory];
          for (let i = 0; i < products.length; i += 5) {
            this.productGroups.push(products.slice(i, i + 5));
          }
        });
      });
      for(let arreglo of this.productGroups){
        for(let product of arreglo){
          if(product.category == 'Madera'){
            this.madera.push(product);
          }else if(product.category == 'Tableros'){
            this.tableros.push(product);
          }else if(product.category == 'Zinc y accesorios'){
            this.zinc.push(product);
          }
          
        }
      }
      this.cat1 = Math.ceil(this.madera.length/5);
      this.cat2 = Math.ceil(this.tableros.length/5);
      this.cat3 = Math.ceil(this.zinc.length/5);
    
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
    this.service.searchExact(name).subscribe(product =>{
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

  // Ícono Font Awesome por categoría (para las tarjetas de categorías)
  catIcon(category: string): string {
    const map: { [k: string]: string } = {
      'Madera': 'fa-tree',
      'Tableros': 'fa-table-cells-large',
      'Zinc y accesorios': 'fa-warehouse',
      'Fijaciones': 'fa-screwdriver-wrench',
      'Art. Ferretería': 'fa-toolbox',
      'Pinturas': 'fa-paint-roller',
      'Puertas': 'fa-door-open',
      'Molduras': 'fa-ruler-combined',
      'Cerco': 'fa-border-all',
      'Radier': 'fa-trowel-bricks',
      'Aislantes': 'fa-temperature-low',
      'Elaborado': 'fa-industry',
      'Quincalleria': 'fa-gears',
    };
    return map[category] || 'fa-box';
  }

  irCategoria(category: string): void {
    this.sharingDataService.subEventEmitter.emit([category, 'todo']);
  }

  // Anuncios (promos) de una categoría
  anunciosDe(categoria: string): Anuncios[] {
    return this.anuncios.filter(a => a.categoria === categoria);
  }

  // Anuncios generales (sin categoría) → sección de Ofertas / Imprescindibles
  anunciosGenerales(): Anuncios[] {
    return this.anuncios.filter(a => !a.categoria);
  }

  // Productos únicos (por nombre) de una categoría, para el carrusel
  productosDe(categoria: string): Product[] {
    const grupos = this.groupedProducts[categoria];
    if (!grupos) return [];
    const vistos = new Set<string>();
    const out: Product[] = [];
    Object.keys(grupos).forEach(sub => {
      grupos[sub].forEach(p => {
        if (!vistos.has(p.name)) { vistos.add(p.name); out.push(p); }
      });
    });
    return out;
  }

  private dedupePorNombre(products: Product[]): Product[] {
    const vistos = new Set<string>();
    return products.filter(p => (vistos.has(p.name) ? false : (vistos.add(p.name), true)));
  }

  private priceLabel(p: Product): string {
    const { min, max } = this.getMaxMin(p.name, p.category, p.subcategory);
    return min === max ? `$${this.formatPrice(min)}` : `$${this.formatPrice(min)} - $${this.formatPrice(max)}`;
  }

  private toCard(p: Product): CarouselCard {
    return { name: p.name, imagen: p.imagen, description: p.description, priceLabel: this.priceLabel(p) };
  }

  // Imprescindibles de temporada = productos destacados
  cardsDestacados(): CarouselCard[] {
    return this.dedupePorNombre(this.stars).map(p => this.toCard(p));
  }

  // Productos en oferta
  cardsOfertas(): CarouselCard[] {
    return this.dedupePorNombre(this.ofertas).map(p => {
      const desc = p.precioOferta && p.price ? Math.round((1 - p.precioOferta / p.price) * 100) : 0;
      return {
        name: p.name,
        imagen: p.imagen,
        description: p.description,
        priceLabel: `$${this.formatPrice(p.precioOferta || p.price)}`,
        oldPriceLabel: `$${this.formatPrice(p.price)}`,
        descuento: desc,
      };
    });
  }

  // Productos de una categoría (para su carrusel)
  cardsDe(categoria: string): CarouselCard[] {
    return this.productosDe(categoria).map(p => this.toCard(p));
  }

  // id de ancla para navegar a la sección de una categoría
  catId(nombre: string): string {
    return 'cat-' + nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  scrollToCat(nombre: string): void {
    const el = document.getElementById(this.catId(nombre));
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
