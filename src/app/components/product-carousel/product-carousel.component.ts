import {
  AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SharingDataService } from '../../services/sharing-data.service';

export interface CarouselCard {
  name: string;
  imagen: string | null;
  description: string;
  priceLabel: string;
  oldPriceLabel?: string;
  descuento?: number;
}

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css',
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
  @Input() items: CarouselCard[] = [];
  @ViewChild('track') track!: ElementRef<HTMLDivElement>;

  dots: number[] = [];
  activeDot = 0;
  canPrev = false;
  canNext = false;

  constructor(
    private service: ProductService,
    private sharingDataService: SharingDataService,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.recompute(), 50);
  }

  ngOnChanges(): void {
    setTimeout(() => this.recompute(), 50);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.recompute();
  }

  private recompute(): void {
    const el = this.track?.nativeElement;
    if (!el || el.clientWidth < 50) return; // ancho aún no calculado
    const pages = Math.min(12, Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)));
    this.dots = Array.from({ length: pages }, (_, i) => i);
    this.onScroll();
  }

  onScroll(): void {
    const el = this.track?.nativeElement;
    if (!el || el.clientWidth < 50) return;
    this.activeDot = Math.min(this.dots.length - 1, Math.round(el.scrollLeft / el.clientWidth));
    this.canPrev = el.scrollLeft > 5;
    this.canNext = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }

  scroll(dir: number): void {
    const el = this.track?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  goToPage(i: number): void {
    const el = this.track?.nativeElement;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }

  verProducto(name: string): void {
    this.service.searchExact(name).subscribe((product) => {
      this.sharingDataService.getProduct.emit(product);
    });
  }
}
