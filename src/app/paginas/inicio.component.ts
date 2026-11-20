import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { BENEFICIOS } from '../config/tienda';
import { ApiService } from '../core/api.service';
import { CotizacionService } from '../core/cotizacion.service';
import { CategoriaDestacada, Familia, ImagenWeb } from '../core/modelos';
import { linkWhatsApp } from '../core/whatsapp';
import { CarruselComponent } from '../ui/carrusel.component';
import { IconoComponent } from '../ui/icono.component';
import { TarjetaFamiliaComponent } from '../ui/tarjeta-familia.component';

interface SeccionCategoria {
  cat: CategoriaDestacada;
  familias: Familia[];
  anuncios: ImagenWeb[];
}

const VACIO = { items: [] as Familia[] };

export function capitalizar(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, IconoComponent, CarruselComponent, TarjetaFamiliaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="contenedor hero-in">
        <div class="hero-texto">
          <span class="pildora">Barraca de maderas y materiales · Alerce, Puerto Montt</span>
          <h1>Todo para tu obra, con despacho en Puerto Montt</h1>
          <p>Arma tu cotización en línea y te confirmamos stock, precio final y despacho por WhatsApp.</p>
          <div class="hero-botones">
            <a class="btn btn-azul btn-grande" routerLink="/catalog">Ver catálogo</a>
            <button type="button" class="btn btn-verde btn-grande" (click)="cotizar()">
              <app-icono nombre="whatsapp" [tam]="20" /> Cotizar por WhatsApp
            </button>
          </div>
          <ul class="checks solo-escritorio">
            <li><app-icono nombre="check" [tam]="15" /> 12 cuotas sin interés</li>
            <li><app-icono nombre="check" [tam]="15" /> WebPay y transferencia</li>
            <li><app-icono nombre="check" [tam]="15" /> Retiro el mismo día</li>
          </ul>
        </div>
        <div class="hero-banner">
          @if (banners().length) {
            <div class="banner-marco">
              @for (b of banners(); track b.id; let i = $index) {
                <img [src]="b.img" alt="Promoción Lawal" [class.activo]="i === slide()" [attr.aria-hidden]="i !== slide()" />
              }
            </div>
            @if (banners().length > 1) {
              <div class="puntos">
                @for (b of banners(); track b.id; let i = $index) {
                  <button type="button" [class.activo]="i === slide()" (click)="irA(i)" [attr.aria-label]="'Banner ' + (i + 1)"></button>
                }
              </div>
            }
          } @else {
            <div class="banner-marco banner-vacio"><img src="Logoblanco3.png" alt="Lawal Constructor" /></div>
          }
        </div>
      </div>
    </section>

    <section class="beneficios">
      <div class="contenedor beneficios-in">
        @for (b of beneficios; track b.titulo) {
          <div class="beneficio">
            <span class="beneficio-icono"><app-icono [nombre]="b.icono" [tam]="20" /></span>
            <div><strong>{{ b.titulo }}</strong><span>{{ b.texto }}</span></div>
          </div>
        }
      </div>
    </section>

    @if (destacadas().length) {
      <section class="seccion">
        <div class="contenedor">
          <div class="seccion-cab">
            <div><h2>Categorías destacadas</h2><p>Todo lo que necesitas para tu obra, en un solo lugar</p></div>
            <a class="link-mas" routerLink="/catalog">Ver catálogo completo <app-icono nombre="chevron-right" [tam]="16" /></a>
          </div>
          <div class="cat-grid">
            @for (c of destacadas(); track c.nombre) {
              <a class="cat-tile" [routerLink]="'/catalog'" [queryParams]="{ categoria: c.nombre }">
                <span class="cat-img">
                  @if (c.imagen) { <img [src]="c.imagen" [alt]="c.nombre" loading="lazy" /> }
                </span>
                <span>{{ cap(c.nombre) }}</span>
              </a>
            }
            <a class="cat-tile" routerLink="/catalog">
              <span class="cat-img cat-todas"><app-icono nombre="menu" [tam]="26" /> Ver catálogo</span>
              <span>Todas</span>
            </a>
          </div>
        </div>
      </section>
    }

    @if (imprescindibles().length) {
      <section class="seccion seccion-gris">
        <div class="contenedor">
          <div class="seccion-cab">
            <div><h2>Imprescindibles de temporada</h2><p>Lo que más se lleva esta temporada en el sur</p></div>
            <a class="link-mas" routerLink="/catalog">Ver más <app-icono nombre="chevron-right" [tam]="16" /></a>
          </div>
          <app-carrusel>
            @for (f of imprescindibles(); track f.id) { <app-tarjeta-familia [f]="f" /> }
          </app-carrusel>
        </div>
      </section>
    }

    @if (ofertas().length) {
      <section class="seccion">
        <div class="contenedor">
          <div class="seccion-cab">
            <div><h2>Productos en oferta</h2><p>Precios rebajados mientras dure el stock</p></div>
            <a class="link-mas" routerLink="/catalog" [queryParams]="{ ofertas: 1 }">Ver todas las ofertas <app-icono nombre="chevron-right" [tam]="16" /></a>
          </div>
          <div class="ofertas-fila">
            <app-tarjeta-familia [f]="ofertas()[0]" />
            <a class="promo" routerLink="/catalog" [queryParams]="{ ofertas: 1 }">
              <span class="promo-tag">Ofertas de la semana</span>
              <strong>Llévate más por menos en materiales para tu obra</strong>
              <span class="promo-txt solo-escritorio">Precios rebajados hasta agotar stock. Agrégalos a tu cotización y te confirmamos disponibilidad por WhatsApp.</span>
              <span class="btn btn-amarillo"><app-icono nombre="chevron-right" [tam]="16" /> Ver todas las ofertas</span>
              <span class="promo-cuotas"><b>12</b>cuotas sin interés</span>
            </a>
          </div>
          @if (ofertas().length > 1) {
            <app-carrusel>
              @for (f of ofertas().slice(1); track f.id) { <app-tarjeta-familia [f]="f" /> }
            </app-carrusel>
          }
        </div>
      </section>
    }

    @if (secciones().length) {
      <nav class="tabs-cat" aria-label="Ir a una categoría">
        <div class="contenedor tabs-in">
          @for (s of secciones(); track s.cat.nombre) {
            <button type="button" [class.activa]="s.cat.nombre === tab()" (click)="irSeccion(s.cat.nombre)">{{ cap(s.cat.nombre) }}</button>
          }
        </div>
      </nav>
      @for (s of secciones(); track s.cat.nombre; let par = $even) {
        <section class="seccion" [class.seccion-gris]="!par" [id]="idSeccion(s.cat.nombre)">
          <div class="contenedor">
            <div class="seccion-cab solo-movil">
              <div><h2>{{ cap(s.cat.nombre) }}</h2><p>{{ s.cat.familias }} productos</p></div>
              <a class="link-mas" [routerLink]="'/catalog'" [queryParams]="{ categoria: s.cat.nombre }">Ver todo</a>
            </div>
            <div class="cat-intro">
              <a class="cat-portada solo-escritorio" [routerLink]="'/catalog'" [queryParams]="{ categoria: s.cat.nombre }"
                 [style.background-image]="s.cat.imagen ? 'url(' + s.cat.imagen + ')' : null">
                <span class="eyebrow-amarillo">{{ s.cat.familias }} productos</span>
                <strong>{{ cap(s.cat.nombre) }}</strong>
                <span class="btn btn-blanco"><app-icono nombre="chevron-right" [tam]="16" /> Ver todo {{ s.cat.nombre.toLowerCase() }}</span>
              </a>
              @for (a of s.anuncios.slice(0, 2); track a.id) {
                <img class="anuncio" [src]="a.img" [alt]="'Anuncio ' + s.cat.nombre" loading="lazy" />
              }
            </div>
            <app-carrusel>
              @for (f of s.familias; track f.id) { <app-tarjeta-familia [f]="f" /> }
            </app-carrusel>
          </div>
        </section>
      }
    }
  `,
})
export class InicioComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private cot = inject(CotizacionService);
  beneficios = BENEFICIOS;
  cap = capitalizar;

  banners = signal<ImagenWeb[]>([]);
  destacadas = signal<CategoriaDestacada[]>([]);
  imprescindibles = signal<Familia[]>([]);
  ofertas = signal<Familia[]>([]);
  secciones = signal<SeccionCategoria[]>([]);
  slide = signal(0);
  tab = signal('');
  private timer: ReturnType<typeof setInterval> | null = null;
  hayBanners = computed(() => this.banners().length > 0);

  ngOnInit(): void {
    this.api.banners().pipe(catchError(() => of([]))).subscribe((b) => {
      this.banners.set(b);
      if (b.length > 1) this.timer = setInterval(() => this.slide.set((this.slide() + 1) % b.length), 5000);
    });
    this.api.familias({ destacados: true, por_pagina: 12 }).pipe(catchError(() => of(VACIO))).subscribe((r) => this.imprescindibles.set(r.items));
    this.api.familias({ ofertas: true, por_pagina: 12 }).pipe(catchError(() => of(VACIO))).subscribe((r) => this.ofertas.set(r.items));
    forkJoin({
      cats: this.api.destacadas().pipe(catchError(() => of([] as CategoriaDestacada[]))),
      anuncios: this.api.anuncios().pipe(catchError(() => of([] as ImagenWeb[]))),
    }).subscribe(({ cats, anuncios }) => {
      const visibles = cats.filter((c) => c.familias > 0);
      this.destacadas.set(cats);
      if (!visibles.length) return;
      this.tab.set(visibles[0].nombre);
      forkJoin(
        visibles.map((c) => this.api.familias({ categoria: c.nombre, por_pagina: 12 }).pipe(catchError(() => of(VACIO)))),
      ).subscribe((res) =>
        this.secciones.set(
          visibles.map((cat, i) => ({
            cat,
            familias: res[i].items,
            anuncios: anuncios.filter((a) => (a.categoria || '').toLowerCase() === cat.nombre.toLowerCase()),
          })),
        ),
      );
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  irA(i: number): void {
    this.slide.set(i);
  }

  idSeccion(nombre: string): string {
    return 'cat-' + nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  irSeccion(nombre: string): void {
    this.tab.set(nombre);
    document.getElementById(this.idSeccion(nombre))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  cotizar(): void {
    if (this.cot.cantidadProductos()) this.cot.abierta.set(true);
    else window.open(linkWhatsApp('Hola Lawal, quiero cotizar.'), '_blank', 'noopener');
  }
}
