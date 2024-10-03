import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Banner } from '../../models/banner';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule,LoaderComponent],
  templateUrl: './banner.component.html'
})
export class BannerComponent implements OnInit{

  banners: Banner[] = [];
  isLoading = true;

  constructor(
    private service: ProductService,
  ){}
  ngOnInit(): void {
    this.service.getBanner().subscribe(banner => {
      this.banners = banner;
      this.isLoading = false;
    });
 

  }

}
