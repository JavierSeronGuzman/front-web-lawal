import { Location, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { BLOQUES_FICHA, DOMINIO_PUBLICO } from '../config/tienda';
import { ApiService } from '../core/api.service';
import { CotizacionService } from '../core/cotizacion.service';
import { conPor, formatoPrecio, idDesdeSegmento, rutaProducto } from '../core/formato';
import { Ficha, Medida } from '../core/modelos';
import { linkWhatsApp, mensajeConsulta } from '../core/whatsapp';
import { CarruselComponent } from '../ui/carrusel.component';
import { IconoComponent } from '../ui/icono.component';
import { ImagenProductoComponent } from '../ui/imagen-producto.component';
import { TarjetaFamiliaComponent } from '../ui/tarjeta-familia.component';
import { capitalizar } from './inicio.component';

/** Ficha: link propio /producto/{id}-{slug}, selector de medida que cambia precio y URL (O4). */
@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, IconoComponent, ImagenProductoComponent, CarruselComponent, TarjetaFamiliaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cargando()) {
      <div class="contenedor"><p class="vacio">Cargando producto…</p></div>
    } @else if (ficha()) { @if (ficha(); as d) {
      @if (!d.disponible) {
        <div class="contenedor no-disponible">
          <nav class="migas"><a routerLink="/">Inicio</a><app-icono nombre="chevron-right" [tam]="14" /><a routerLink="/catalog">Catálogo</a></nav>
          <h1>Este producto no está disponible</h1>
          <p>Puede que se haya agotado o que ya no lo vendamos por la web. Mira estas alternativas o escríbenos por WhatsApp.</p>
          <a class="btn btn-azul" routerLink="/catalog" [queryParams]="d.categoria ? { categoria: d.categoria } : {}">Ver catálogo</a>
        </div>
      } @else {
        <div class="contenedor ficha">
          <nav class="migas" aria-label="Ruta">
            <a routerLink="/">Inicio</a><app-icono nombre="chevron-right" [tam]="14" />
            <a [routerLink]="'/catalog'" [queryParams]="{ categoria: d.categoria }">{{ cap(d.categoria || '') }}</a><app-icono nombre="chevron-right" [tam]="14" />
            <span>{{ por(d.nombre) }}</span>
          </nav>
          <div class="ficha-in">
            <div class="ficha-foto">
              <app-imagen-producto [src]="imagen()" [alt]="por(d.nombre) + ' ' + (sel()?.etiqueta || '')" />
            </div>
            <div class="ficha-info">
              <span class="eyebrow">{{ (d.categoria || '').toUpperCase() }} · CÓDIGO {{ sel()?.id }}</span>
              <h1>{{ por(d.nombre) }}</h1>
              @if (d.descripcion && d.descripcion !== d.nombre) {<p class="ficha-desc">{{ d.descripcion }}</p>}
              <div class="ficha-precio">
                <strong data-test="precio">{{ precio(sel()?.precio) }}</strong>
                @if (sel()?.precio_normal) {<s>{{ precio(sel()?.precio_normal) }}</s>}
                <small>c/u</small>
              </div>
              @if ((d.medidas?.length ?? 0) > 1) {
                <p class="nota">El precio cambia según la medida que elijas</p>
                <h3 class="ficha-sub">Medida</h3>
                <div class="medidas" role="radiogroup" aria-label="Medida">
                  @for (m of d.medidas; track m.id) {
                    <button type="button" role="radio" class="medida" [class.activa]="m.id === sel()?.id" [attr.aria-checked]="m.id === sel()?.id" (click)="elegir(m)">
                      <strong>{{ m.etiqueta || por(d.nombre) }}</strong>
                      <span>{{ precio(m.precio) }}</span>
                    </button>
                  }
                </div>
              } @else if (sel()?.etiqueta) {
                <p class="nota">Medida: <strong>{{ sel()?.etiqueta }}</strong></p>
              }
              <p class="disponible"><app-icono nombre="check" [tam]="16" [grosor]="2.5" /> Disponible · te confirmamos el stock al cotizar</p>
              <div class="ficha-comprar solo-escritorio">
                <ng-container *ngTemplateOutlet="stepper" />
                <button type="button" class="btn btn-azul btn-grande flex1" (click)="agregar()"><app-icono nombre="cart" [tam]="20" /> Agregar a la cotización</button>
              </div>
              <a class="btn btn-verde-borde btn-ancho" [href]="consulta()" target="_blank" rel="noopener">
                <app-icono nombre="whatsapp" [tam]="18" /> Consultar este producto por WhatsApp
              </a>
              <ul class="bloques">
                @for (b of bloques; track b.titulo) {
                  <li><span class="beneficio-icono"><app-icono [nombre]="b.icono" [tam]="18" /></span><div><strong>{{ b.titulo }}</strong><span>{{ b.texto }}</span></div></li>
                }
              </ul>
              <button type="button" class="compartir" (click)="compartir()">
                <app-icono nombre="share" [tam]="16" /> Compartir este producto · {{ linkPublico() }}
              </button>
            </div>
          </div>
        </div>
        <div class="barra-comprar solo-movil">
          <div><strong>{{ precio(sel()?.precio) }}</strong><small>c/u{{ sel()?.etiqueta ? ' · ' + sel()?.etiqueta : '' }}</small></div>
          <ng-container *ngTemplateOutlet="stepper" />
          <button type="button" class="btn btn-azul" (click)="agregar()"><app-icono nombre="cart" [tam]="18" /> Agregar</button>
        </div>
      }
      @if (d.relacionados.length) {
        <section class="seccion seccion-gris">
          <div class="contenedor">
            <div class="seccion-cab">
              <div><h2>{{ d.disponible ? 'Complementa tu proyecto' : 'Productos relacionados' }}</h2></div>
              @if (d.categoria) {
                <a class="link-mas" [routerLink]="'/catalog'" [queryParams]="{ categoria: d.categoria }">Ver más de {{ cap(d.categoria) }} <app-icono nombre="chevron-right" [tam]="16" /></a>
              }
            </div>
            <app-carrusel>
              @for (f of d.relacionados; track f.id) { <app-tarjeta-familia [f]="f" /> }
            </app-carrusel>
          </div>
        </section>
      }
    } }

    <ng-template #stepper>
      <div class="stepper grande" role="group" aria-label="Cantidad">
        <button type="button" aria-label="Menos" [disabled]="cantidad() <= 1" (click)="cantidad.set(cantidad() - 1)"><app-icono nombre="minus" [tam]="16" /></button>
        <input type="number" min="1" inputmode="numeric" [value]="cantidad()" (change)="cantidadInput($event)" aria-label="Cantidad" />
        <button type="button" aria-label="Más" (click)="cantidad.set(cantidad() + 1)"><app-icono nombre="plus" [tam]="16" /></button>
      </div>
    </ng-template>
  `,
})
export class ProductoComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private title = inject(Title);
  private destroy = inject(DestroyRef);
  private cot = inject(CotizacionService);

  ficha = signal<Ficha | null>(null);
  selId = signal<number | null>(null);
  cantidad = signal(1);
  cargando = signal(true);
  bloques = BLOQUES_FICHA;
  precio = formatoPrecio;
  por = conPor;
  cap = capitalizar;

  sel = computed<Medida | null>(() => {
    const d = this.ficha();
    if (!d?.disponible) return null;
    return d.medidas?.find((m) => m.id === this.selId()) ?? d.medidas?.[0] ?? null;
  });
  imagen = computed(() => this.sel()?.imagen || this.ficha()?.imagen || null);
  consulta = computed(() => linkWhatsApp(mensajeConsulta(this.ficha()?.nombre || '', this.sel()?.etiqueta || '')));
  linkPublico = computed(() => {
    const s = this.sel();
    return s ? `${DOMINIO_PUBLICO}${rutaProducto(s.id, s.slug)}` : DOMINIO_PUBLICO;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe((pm) => {
      const seg = pm.get('idslug');
      const id = idDesdeSegmento(seg);
      if (id === null) {
        this.router.navigate(['/catalog'], { replaceUrl: true });
        return;
      }
      const actual = this.ficha();
      if (actual?.disponible && actual.medidas?.some((m) => m.id === id)) {
        this.selId.set(id);
        return;
      }
      this.cargando.set(true);
      this.api
        .ficha(id)
        .pipe(catchError(() => of({ disponible: false, solicitado_id: id, relacionados: [] } as Ficha)))
        .subscribe((d) => {
          this.ficha.set(d);
          this.cargando.set(false);
          this.cantidad.set(1);
          if (!d.disponible || !d.id) {
            this.title.setTitle('Producto no disponible · Lawal Constructor');
            return;
          }
          this.selId.set(d.id);
          this.title.setTitle(`${conPor(d.nombre)} · Lawal Constructor`);
          // El slug es decorativo: se busca por id; si no coincide (o abrió otra medida) se corrige la URL.
          const canon = `${d.id}-${d.slug}`;
          if (seg !== canon) this.router.navigate(['/producto', canon], { replaceUrl: true });
        });
    });
  }

  elegir(m: Medida): void {
    this.selId.set(m.id);
    // Cambia la URL sin recargar.
    this.location.replaceState(rutaProducto(m.id, m.slug));
  }

  cantidadInput(ev: Event): void {
    this.cantidad.set(Math.max(1, Math.floor(Number((ev.target as HTMLInputElement).value) || 1)));
  }

  agregar(): void {
    const d = this.ficha();
    const s = this.sel();
    if (!d || !s) return;
    this.cot.agregar(
      { id: s.id, nombre: d.nombre || '', medida: s.etiqueta, precio: s.precio, imagen: s.imagen || d.imagen || null, slug: s.slug },
      this.cantidad(),
    );
  }

  compartir(): void {
    const url = `${location.origin}${rutaProducto(this.sel()!.id, this.sel()!.slug)}`;
    const nav = navigator as Navigator & { share?: (d: { url: string; title?: string }) => Promise<void> };
    if (nav.share) {
      nav.share({ url, title: this.ficha()?.nombre }).catch(() => undefined);
    } else {
      navigator.clipboard?.writeText(url).then(
        () => this.cot.mostrarAviso('Link copiado', url),
        () => undefined,
      );
    }
  }
}
