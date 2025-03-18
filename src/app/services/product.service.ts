import { Injectable, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductStar } from '../models/productStar';
import { Banner } from '../models/banner';
import { Anuncios } from '../models/anuncios';
import { SharingDataService } from './sharing-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService{


  constructor(
    private http: HttpClient, private sharingDataService: SharingDataService
  ) { }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>("https://getbackseron.com/api/cotizacion/products ")
  }
  getProductsStars(): Observable<ProductStar[]>{
    return this.http.get<ProductStar[]>("https://getbackseron.com/api/extras/products ")
  }
  getBanner(): Observable<Banner[]>{
    return this.http.get<Banner[]>("https://getbackseron.com/api/images/banners ")
  }
  getAnuncios(): Observable<Anuncios[]>{
    return this.http.get<Anuncios[]>("https://getbackseron.com/api/images/anuncios ")
  }

  search(name: string): Observable<Product[]>{
      return this.http.get<Product[]>(`https://getbackseron.com/api/cotizacion/search?name=${name}`)
    }
  
  getProduct(id:number): Observable<Product>{
    return this.http.get<Product>(`https://getbackseron.com/api/cotizacion/${id}`)
  }
  searchExact(name: string): Observable<Product[]>{
    return this.http.get<Product[]>(`https://getbackseron.com/api/cotizacion/searchExact?name=${name}`)
  }

}
