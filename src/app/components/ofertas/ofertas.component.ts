import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Anuncios } from '../../models/anuncios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css'
})
export class OfertasComponent implements OnInit{

  anuncios: Anuncios[] = [];

  constructor(
    private service: ProductService,
  ){}
  ngOnInit(): void {
    this.service.getAnuncios().subscribe(anuncio => {
      this.anuncios = anuncio;
    });
  }


}
