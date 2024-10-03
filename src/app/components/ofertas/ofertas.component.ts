import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Anuncios } from '../../models/anuncios';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [RouterModule,CommonModule,LoaderComponent],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css'
})
export class OfertasComponent implements OnInit{

  anuncios: Anuncios[] = [];

  isLoading = true;

  constructor(
    private service: ProductService,
  ){}
  ngOnInit(): void {
    this.service.getAnuncios().subscribe(anuncio => {
      this.anuncios = anuncio;
      this.isLoading = false;
    });
  }


}
