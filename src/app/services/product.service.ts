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
    return this.http.get<Product[]>("http://ec2-18-217-74-222.us-east-2.compute.amazonaws.com:8080/api/cotizacion/products ")
  }
  getProductsStars(): Observable<ProductStar[]>{
    return this.http.get<ProductStar[]>("http://ec2-18-217-74-222.us-east-2.compute.amazonaws.com:8080/api/extras/products ")
  }
  getBanner(): Observable<Banner[]>{
    return this.http.get<Banner[]>("http://ec2-18-217-74-222.us-east-2.compute.amazonaws.com:8080/api/images/banners ")
  }
  getAnuncios(): Observable<Anuncios[]>{
    return this.http.get<Anuncios[]>("http://ec2-18-217-74-222.us-east-2.compute.amazonaws.com:8080/api/images/anuncios ")
  }

  search(name: string): Observable<Product[]>{
      return this.http.get<Product[]>(`http://ec2-18-217-74-222.us-east-2.compute.amazonaws.com:8080/api/cotizacion/search?name=${name}`)
    }
  
  getProduct(id:number): Observable<Product>{
    return this.http.get<Product>(`http://ec2-18-217-74-222.us-east-2.compute.amazonaws.com:8080/api/cotizacion/${id}`)
  }
}