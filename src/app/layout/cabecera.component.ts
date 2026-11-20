import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TELEFONO_TEXTO, TIENDA } from '../config/tienda';
import { ApiService } from '../core/api.service';
import { CotizacionService } from '../core/cotizacion.service';
import { formatoPrecio } from '../core/formato';
import { linkWhatsApp } from '../core/whatsapp';
import { IconoComponent } from '../ui/icono.component';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [RouterLink, FormsModule, IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="topbar solo-escritorio">
      <div class="contenedor topbar-in">
        <span><app-icono nombre="truck" [tam]="15" /> {{ tienda.despacho }}</span>
        <span class="topbar-der">
          <span><app-icono nombre="clock" [tam]="15" /> {{ tienda.horario }}</span>
          <a [href]="wa"><app-icono nombre="phone" [tam]="15" /> {{ telefono }}</a>
        </span>
      </div>
    </div>

    <header class="header">
      <div class="contenedor header-in">
        <button type="button" class="icono-btn solo-movil" aria-label="Abrir menú" (click)="menuMovil.set(true)">
          <app-icono nombre="menu" [tam]="24" />
        </button>
        <a routerLink="/" class="logo" aria-label="Lawal Constructor, inicio">
          <img src="logoblancoess.png" alt="Lawal Constructor" />
        </a>
        <form class="buscador" role="search" (ngSubmit)="buscar()">
          <app-icono class="lupa solo-movil" nombre="search" [tam]="18" />
          <input
            type="search"
            name="q"
            [(ngModel)]="q"
            placeholder="Busca madera, pinturas, herramientas..."
            aria-label="Buscar productos"
          />
          <button type="submit" class="btn-buscar solo-escritorio"><app-icono nombre="search" [tam]="18" /> Buscar</button>
        </form>
        <button type="button" class="btn btn-verde solo-escritorio" (click)="cotizarWhatsApp()">
          <app-icono nombre="whatsapp" [tam]="18" /> Cotizar por WhatsApp
        </button>
        <button type="button" class="mi-cotizacion" (click)="cot.abierta.set(true)" aria-label="Mi cotización">
          <span class="carrito">
            <app-icono nombre="cart" [tam]="24" />
            @if (cot.cantidadProductos()) {<span class="burbuja">{{ cot.cantidadProductos() }}</span>}
          </span>
          <span class="solo-escritorio mi-cot-txt">
            <strong>Mi cotización</strong>
            <small>{{ precio(cot.total()) }}</small>
          </span>
        </button>
      </div>
    </header>

    <nav class="catbar solo-escritorio" aria-label="Categorías">
      <div class="contenedor catbar-in">
        <div class="todas" (mouseleave)="todas.set(false)">
          <button type="button" class="btn-todas" (click)="todas.set(!todas())" [attr.aria-expanded]="todas()">
            <app-icono nombre="menu" [tam]="16" /> Todas las categorías <app-icono nombre="chevron-down" [tam]="16" />
          </button>
          @if (todas()) {
            <div class="desplegable">
              @for (c of menu(); track c.nombre) {
                <div class="grupo">
                  <a [routerLink]="'/catalog'" [queryParams]="{ categoria: c.nombre }" (click)="todas.set(false)">
                    <strong>{{ c.nombre }}</strong> <span>{{ c.n }}</span>
                  </a>
                  @if (c.hijas.length > 1) {
                    @for (h of c.hijas; track h.nombre) {
                      <a class="hija" [routerLink]="'/catalog'" [queryParams]="{ categoria: h.nombre }" (click)="todas.set(false)">{{ h.nombre }}</a>
                    }
                  }
                </div>
              }
              <a class="ver-todo" routerLink="/catalog" (click)="todas.set(false)">Ver catálogo completo</a>
            </div>
          }
        </div>
        <div class="catbar-links">
          @for (c of menu().slice(0, 8); track c.nombre) {
            <a [routerLink]="'/catalog'" [queryParams]="{ categoria: c.nombre }">{{ c.nombre }}</a>
          }
        </div>
        <div class="catbar-der">
          <a class="rojo" routerLink="/catalog" [queryParams]="{ ofertas: 1 }">Ofertas</a>
          <a routerLink="/nosotros" fragment="como-cotizar">Cómo cotizar</a>
          <a routerLink="/nosotros">Nosotros</a>
        </div>
      </div>
    </nav>

    @if (menuMovil()) {
      <div class="velo" (click)="menuMovil.set(false)"></div>
      <aside class="menu-movil" aria-label="Menú">
        <div class="menu-movil-cab">
          <strong>Categorías</strong>
          <button type="button" class="icono-btn" aria-label="Cerrar" (click)="menuMovil.set(false)"><app-icono nombre="x" /></button>
        </div>
        <a routerLink="/catalog" (click)="menuMovil.set(false)">Ver catálogo completo</a>
        <a class="rojo" routerLink="/catalog" [queryParams]="{ ofertas: 1 }" (click)="menuMovil.set(false)">Ofertas</a>
        @for (c of menu(); track c.nombre) {
          <a [routerLink]="'/catalog'" [queryParams]="{ categoria: c.nombre }" (click)="menuMovil.set(false)">
            {{ c.nombre }} <span>{{ c.n }}</span>
          </a>
        }
        <a routerLink="/nosotros" fragment="como-cotizar" (click)="menuMovil.set(false)">Cómo cotizar</a>
        <a routerLink="/nosotros" (click)="menuMovil.set(false)">Nosotros</a>
      </aside>
    }
  `,
})
export class CabeceraComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  cot = inject(CotizacionService);

  tienda = TIENDA;
  telefono = TELEFONO_TEXTO;
  wa = linkWhatsApp();
  precio = formatoPrecio;
  q = '';
  todas = signal(false);
  menuMovil = signal(false);
  menu = toSignal(this.api.categorias().pipe(catchError(() => of([]))), { initialValue: [] });

  buscar(): void {
    const q = this.q.trim();
    this.router.navigate(['/catalog'], { queryParams: q ? { q } : {} });
  }

  /** Con productos abre la cotización; vacía, abre WhatsApp con un saludo. */
  cotizarWhatsApp(): void {
    if (this.cot.cantidadProductos()) this.cot.abierta.set(true);
    else window.open(linkWhatsApp('Hola Lawal, quiero cotizar.'), '_blank', 'noopener');
  }

  @HostListener('document:keydown.escape')
  cerrar(): void {
    this.todas.set(false);
    this.menuMovil.set(false);
  }
}
