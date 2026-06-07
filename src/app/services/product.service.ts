import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductStar } from '../models/productStar';
import { Banner } from '../models/banner';
import { Anuncios } from '../models/anuncios';
import { CategoriaDestacada } from '../models/categoriaDestacada';
import { SharingDataService } from './sharing-data.service';
import { environment } from '../../environments/environment';

// Backend del sistema (newlawal) — módulo web. URL según environment
// (local: localhost:8000; producción: environment.prod.ts).
const API = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductService{


  constructor(
    private http: HttpClient, private sharingDataService: SharingDataService
  ) { }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${API}/products`)
  }
  getProductsStars(): Observable<ProductStar[]>{
    return this.http.get<ProductStar[]>(`${API}/products/stars`)
  }
  getOfertas(): Observable<Product[]>{
    return this.http.get<Product[]>(`${API}/products/ofertas`)
  }
  getBanner(): Observable<Banner[]>{
    return this.http.get<Banner[]>(`${API}/banners`)
  }
  getAnuncios(): Observable<Anuncios[]>{
    return this.http.get<Anuncios[]>(`${API}/anuncios`)
  }
  getCategoriasDestacadas(): Observable<CategoriaDestacada[]>{
    return this.http.get<CategoriaDestacada[]>(`${API}/categorias-destacadas`)
  }

  search(name: string): Observable<Product[]>{
      return this.http.get<Product[]>(`${API}/search?name=${name}`)
    }

  getProduct(id:number): Observable<Product>{
    return this.http.get<Product>(`${API}/products/${id}`)
  }
  searchExact(name: string): Observable<Product[]>{
    return this.http.get<Product[]>(`${API}/searchExact?name=${name}`)
  }

}
