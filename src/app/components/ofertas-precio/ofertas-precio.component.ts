import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-ofertas-precio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ofertas-precio.component.html',
  styleUrl: './ofertas-precio.component.css',
})
export class OfertasPrecioComponent implements OnInit {
  ofertas: Product[] = [];

  constructor(
    private service: ProductService,
    private sharingDataService: SharingDataService,
  ) {}

  ngOnInit(): void {
    this.service.getOfertas().subscribe((p) => (this.ofertas = p));
  }

  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  descuento(p: Product): number {
    if (!p.precioOferta || !p.price) return 0;
    return Math.round((1 - p.precioOferta / p.price) * 100);
  }

  verProducto(name: string): void {
    this.service.searchExact(name).subscribe((product) => {
      this.sharingDataService.getProduct.emit(product);
    });
  }
}
