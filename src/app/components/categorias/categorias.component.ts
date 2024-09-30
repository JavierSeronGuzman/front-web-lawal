import { Component, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { GroupedProducts } from '../../models/groupedProducts';
import { SharingDataService } from '../../services/sharing-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent{

  products: Product[] = [];
  groupedProducts: any = {};

  constructor(
    private service: ProductService,
    private sharingDataService: SharingDataService,
    private router: Router
    
  ){}
  

  ngOnInit(): void {
    this.service.getProducts().subscribe(products => {
      this.products = products;
      this.group();
    });
  }

  group(){
    this.groupedProducts = this.products.reduce<GroupedProducts>((acumulador,product) =>{
      if(!acumulador[product.category]){
        acumulador[product.category] = {};
      }

      if(!acumulador[product.category][product.subcategory]){
        acumulador[product.category][product.subcategory] = [];
      }

      acumulador[product.category][product.subcategory].push(product);
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

  }

  getCategoryKeys(): string[] {
    return Object.keys(this.groupedProducts);
  }
  getSubcategoryKeys(category: string): string[] {
    return Object.keys(this.groupedProducts[category] || {});
  }

  sub(category: string, subcategory:string):void {
    setTimeout(() =>{
      this.sharingDataService.subEventEmitter.emit([category,subcategory]);

    },0.5);
  }

}
