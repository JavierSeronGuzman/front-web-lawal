import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Familia } from '../core/modelos';
import { conPor, formatoPrecio, rutaProducto } from '../core/formato';
import { CotizacionService } from '../core/cotizacion.service';
import { IconoComponent } from './icono.component';
import { ImagenProductoComponent } from './imagen-producto.component';

/** Tarjeta por familia: "N largos", "Desde $X" (tachado si hay oferta). */
@Component({
  selector: 'app-tarjeta-familia',
  standalone: true,
  imports: [RouterLink, IconoComponent, ImagenProductoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="tarjeta" [class.lista]="vista() === 'lista'">
      <a class="foto" [routerLink]="ruta()" [attr.aria-label]="nombre()">
        <app-imagen-producto [src]="f().imagen" [alt]="nombre()" />
        @if (f().oferta && f().precio_normal) {
          <span class="badge-oferta">-{{ descuento() }}%</span>
        } @else if (f().alguna_oferta) {
          <span class="badge-oferta">Oferta</span>
        }
      </a>
      <div class="cuerpo">
        <span class="eyebrow">{{ etiqueta() }}</span>
        <a class="nombre" [routerLink]="ruta()">{{ nombre() }}</a>
        <span class="detalle">{{ varias() ? f().medidas + ' ' + f().unidad_medidas : f().medida }}</span>
        <div class="precio">
          @if (varias()) {<small>Desde</small>}
          <strong>{{ precio(f().desde) }}</strong>
          @if (f().precio_normal) {<s>{{ precio(f().precio_normal) }}</s>}
          <small>c/u</small>
        </div>
        @if (varias()) {
          <a class="btn btn-borde" [routerLink]="ruta()"><app-icono nombre="chevron-right" [tam]="16" /> Ver medidas</a>
        } @else {
          <button type="button" class="btn btn-borde" (click)="agregar()"><app-icono nombre="plus" [tam]="16" /> Agregar</button>
        }
      </div>
    </article>
  `,
})
export class TarjetaFamiliaComponent {
  private cot = inject(CotizacionService);
  f = input.required<Familia>();
  vista = input<'grilla' | 'lista'>('grilla');

  nombre = computed(() => conPor(this.f().nombre));
  varias = computed(() => this.f().medidas > 1);
  etiqueta = computed(() => this.f().subtipo || this.f().categoria);
  ruta = computed(() => rutaProducto(this.f().producto_id, this.f().slug));
  descuento = computed(() => {
    const n = this.f().precio_normal || 0;
    return n ? Math.round((1 - this.f().desde / n) * 100) : 0;
  });
  precio = formatoPrecio;

  agregar(): void {
    const f = this.f();
    this.cot.agregar({ id: f.producto_id, nombre: f.nombre, medida: f.medida, precio: f.desde, imagen: f.imagen, slug: f.slug });
  }
}
