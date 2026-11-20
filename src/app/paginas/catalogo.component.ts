import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, catchError, of } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Conteo, Familia, RespuestaFamilias } from '../core/modelos';
import { conPor, formatoPrecio } from '../core/formato';
import {
  FILTROS_VACIOS,
  FiltrosCatalogo,
  cantidadFiltrosActivos,
  consultaApi,
  filtrosDesdeParams,
  paramsDesdeFiltros,
} from '../core/filtros';
import { IconoComponent } from '../ui/icono.component';
import { TarjetaFamiliaComponent } from '../ui/tarjeta-familia.component';
import { capitalizar } from './inicio.component';

type Lista = 'tipo' | 'escuadria' | 'largo';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, IconoComponent, TarjetaFamiliaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contenedor catalogo">
      <nav class="migas" aria-label="Ruta">
        <a routerLink="/">Inicio</a><app-icono nombre="chevron-right" [tam]="14" />
        @if (f().categoria) {
          <a routerLink="/catalog">Catálogo</a><app-icono nombre="chevron-right" [tam]="14" /><span>{{ titulo() }}</span>
        } @else {
          <span>Catálogo</span>
        }
      </nav>
      <h1 class="titulo-pagina">{{ titulo() }}</h1>
      <p class="sub-pagina">
        <span class="solo-movil">{{ r()?.total ?? 0 }} productos · </span>{{ subtitulo() }}
      </p>

      @if (chips().length > 1) {
        <div class="chips" role="tablist" aria-label="Subtipos">
          <button type="button" class="chip" [class.activo]="!f().sub" (click)="cambiar({ sub: '' })">
            Todo <span>{{ r()?.conteos?.chips_total }}</span>
          </button>
          @for (c of chips(); track c.valor) {
            <button type="button" class="chip" [class.activo]="eq(f().sub, c.valor)" (click)="cambiar({ sub: c.valor })">
              {{ cap(c.valor) }} <span>{{ c.n }}</span>
            </button>
          }
        </div>
      }

      <div class="barra-movil solo-movil">
        <button type="button" (click)="hoja.set(true)">
          <app-icono nombre="sliders" [tam]="18" /> Filtrar
          @if (activos()) {<span class="burbuja-azul">{{ activos() }}</span>}
        </button>
        <label class="select-orden">
          <select [value]="f().orden" (change)="orden($event)" aria-label="Ordenar">
            <option value="destacados">Destacados</option>
            <option value="precio">Menor precio</option>
            <option value="precio_desc">Mayor precio</option>
          </select>
          <app-icono nombre="chevron-down" [tam]="16" />
        </label>
      </div>

      <div class="catalogo-in">
        <aside class="filtros solo-escritorio" aria-label="Filtros">
          <ng-container *ngTemplateOutlet="panelFiltros" />
        </aside>

        <section class="resultados">
          <div class="toolbar solo-escritorio">
            <span><strong>{{ r()?.total ?? 0 }} productos</strong>@if (f().categoria) { en {{ titulo() }}}</span>
            <div class="toolbar-der">
              <label>Ordenar por</label>
              <label class="select-orden">
                <select [value]="f().orden" (change)="orden($event)" aria-label="Ordenar">
                  <option value="destacados">Destacados</option>
                  <option value="precio">Menor precio</option>
                  <option value="precio_desc">Mayor precio</option>
                </select>
                <app-icono nombre="chevron-down" [tam]="16" />
              </label>
              <div class="vistas">
                <button type="button" aria-label="Ver en grilla" [class.activo]="f().vista === 'grilla'" (click)="cambiar({ vista: 'grilla' }, false)"><app-icono nombre="grid" [tam]="18" /></button>
                <button type="button" aria-label="Ver en lista" [class.activo]="f().vista === 'lista'" (click)="cambiar({ vista: 'lista' }, false)"><app-icono nombre="list" [tam]="18" /></button>
              </div>
            </div>
          </div>

          @if (cargando() && !items().length) {
            <p class="vacio">Cargando productos…</p>
          } @else if (error()) {
            <p class="vacio">No pudimos cargar el catálogo. Intenta de nuevo en un momento.</p>
          } @else if (!items().length) {
            <div class="vacio">
              <p>No encontramos productos con estos filtros.</p>
              <button type="button" class="btn btn-borde" (click)="limpiar()">Limpiar filtros</button>
            </div>
          } @else {
            <div class="grilla" [class.grilla-lista]="f().vista === 'lista'">
              @for (fam of items(); track fam.id) { <app-tarjeta-familia [f]="fam" [vista]="f().vista" /> }
            </div>
            <div class="paginacion solo-escritorio">
              <span>Mostrando {{ desde() }}–{{ hasta() }} de {{ r()?.total }} productos</span>
              @if ((r()?.paginas ?? 1) > 1) {
                <div class="paginas">
                  <button type="button" aria-label="Página anterior" [disabled]="f().pagina <= 1" (click)="pagina(f().pagina - 1)"><app-icono nombre="chevron-left" [tam]="16" /></button>
                  @for (p of paginas(); track p) {
                    <button type="button" [class.activo]="p === f().pagina" (click)="pagina(p)">{{ p }}</button>
                  }
                  <button type="button" aria-label="Página siguiente" [disabled]="f().pagina >= (r()?.paginas ?? 1)" (click)="pagina(f().pagina + 1)"><app-icono nombre="chevron-right" [tam]="16" /></button>
                </div>
              }
            </div>
            <div class="cargar-mas solo-movil">
              <span>Mostrando {{ items().length + (f().pagina - 1) * 24 }} de {{ r()?.total }} productos</span>
              @if (paginaMovil() < (r()?.paginas ?? 1)) {
                <button type="button" class="btn btn-borde btn-ancho" [disabled]="cargando()" (click)="cargarMas()">Cargar más productos</button>
              }
            </div>
          }
        </section>
      </div>
    </div>

    @if (hoja()) {
      <div class="velo" (click)="hoja.set(false)"></div>
      <div class="hoja" role="dialog" aria-modal="true" aria-label="Filtrar">
        <span class="hoja-asa"></span>
        <div class="hoja-cab">
          <strong>Filtrar</strong>
          <button type="button" class="link-azul" (click)="limpiar()">Limpiar</button>
        </div>
        <div class="hoja-cuerpo"><ng-container *ngTemplateOutlet="panelFiltros" /></div>
        <div class="hoja-pie">
          <button type="button" class="btn btn-azul btn-ancho" (click)="hoja.set(false)">Ver {{ r()?.total ?? 0 }} productos</button>
        </div>
      </div>
    }

    <ng-template #panelFiltros>
      @if (activos()) {
        <div class="activos">
          @for (t of f().tipo; track t) { <button type="button" class="tag" (click)="alternar('tipo', t)">{{ cap(t) }} <app-icono nombre="x" [tam]="12" /></button> }
          @for (e of f().escuadria; track e) { <button type="button" class="tag" (click)="alternar('escuadria', e)">{{ por(e) }} <app-icono nombre="x" [tam]="12" /></button> }
          @for (l of f().largo; track l) { <button type="button" class="tag" (click)="alternar('largo', l)">Largo {{ textoLargo(l) }} <app-icono nombre="x" [tam]="12" /></button> }
          @if (f().ofertas) { <button type="button" class="tag" (click)="cambiar({ ofertas: false })">Solo ofertas <app-icono nombre="x" [tam]="12" /></button> }
        </div>
      }
      <details class="grupo-filtro" open>
        <summary>Categoría <app-icono nombre="chevron-down" [tam]="16" /></summary>
        <div class="cats">
          @for (c of categoriasVisibles(); track c.valor) {
            <button type="button" [class.activa]="eq(f().categoria, c.valor)" (click)="cambiar({ categoria: c.valor, sub: '', tipo: [], escuadria: [], largo: [] })">
              {{ c.valor }} <span>{{ c.n }}</span>
            </button>
          }
          @if ((r()?.conteos?.categorias?.length ?? 0) > 7) {
            <button type="button" class="link-azul" (click)="todasCats.set(!todasCats())">
              {{ todasCats() ? 'Ver menos' : 'Ver las ' + r()?.conteos?.categorias?.length + ' categorías' }}
            </button>
          }
        </div>
      </details>
      @if (r()?.conteos?.madera) {
        @if (r()!.conteos.tipos.length) {
          <details class="grupo-filtro" open>
            <summary>Tipo de madera <app-icono nombre="chevron-down" [tam]="16" /></summary>
            @for (t of r()!.conteos.tipos; track t.valor) {
              <label class="check"><input type="checkbox" [checked]="tiene('tipo', t.valor)" (change)="alternar('tipo', t.valor)" /> {{ cap(t.valor) }} <span>{{ t.n }}</span></label>
            }
          </details>
        }
        @if (r()!.conteos.escuadrias.length) {
          <details class="grupo-filtro" open>
            <summary>Escuadría <app-icono nombre="chevron-down" [tam]="16" /></summary>
            <div class="escuadrias">
              @for (e of r()!.conteos.escuadrias; track e.valor) {
                <button type="button" class="esc" [class.activo]="tiene('escuadria', e.valor)" (click)="alternar('escuadria', e.valor)">{{ por(e.valor) }}</button>
              }
            </div>
          </details>
        }
        @if (r()!.conteos.largos.length) {
          <details class="grupo-filtro" open>
            <summary>Largo <app-icono nombre="chevron-down" [tam]="16" /></summary>
            @for (l of r()!.conteos.largos; track l.valor) {
              <label class="check"><input type="checkbox" [checked]="tiene('largo', l.valor)" (change)="alternar('largo', l.valor)" /> {{ l.texto }} <span>{{ l.n }}</span></label>
            }
          </details>
        }
      }
      <details class="grupo-filtro" open>
        <summary>Precio <app-icono nombre="chevron-down" [tam]="16" /></summary>
        <div class="rango">
          <input type="number" min="0" inputmode="numeric" [placeholder]="precio(r()?.conteos?.precio_min ?? 0)" [value]="f().precioMin ?? ''" (change)="precioCambio('precioMin', $event)" aria-label="Precio mínimo" />
          <span>—</span>
          <input type="number" min="0" inputmode="numeric" [placeholder]="precio(r()?.conteos?.precio_max ?? 0)" [value]="f().precioMax ?? ''" (change)="precioCambio('precioMax', $event)" aria-label="Precio máximo" />
        </div>
      </details>
      <label class="grupo-filtro interruptor">
        <span><strong>Solo ofertas</strong><small>{{ r()?.conteos?.ofertas ?? 0 }} {{ (r()?.conteos?.ofertas ?? 0) === 1 ? 'producto' : 'productos' }}</small></span>
        <input type="checkbox" role="switch" [checked]="f().ofertas" (change)="cambiar({ ofertas: !f().ofertas })" />
      </label>
    </ng-template>
  `,
})
export class CatalogoComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy = inject(DestroyRef);

  f = signal<FiltrosCatalogo>({ ...FILTROS_VACIOS });
  r = signal<RespuestaFamilias | null>(null);
  items = signal<Familia[]>([]);
  paginaMovil = signal(1);
  cargando = signal(false);
  error = signal(false);
  hoja = signal(false);
  todasCats = signal(false);
  private sub?: Subscription;

  cap = capitalizar;
  por = conPor;
  precio = formatoPrecio;

  activos = computed(() => cantidadFiltrosActivos(this.f()));
  chips = computed<Conteo[]>(() => this.r()?.conteos?.chips ?? []);
  categoriasVisibles = computed(() => {
    const cats = this.r()?.conteos?.categorias ?? [];
    return this.todasCats() ? cats : cats.slice(0, 7);
  });
  titulo = computed(() => {
    const f = this.f();
    if (f.categoria) return capitalizar(f.categoria);
    if (f.q) return `Resultados para “${f.q}”`;
    if (f.ofertas) return 'Ofertas';
    return 'Catálogo';
  });
  subtitulo = computed(() => {
    const c = this.r()?.conteos;
    if (!c) return '';
    if (this.f().categoria && c.chips.length > 1) return c.chips.map((x) => capitalizar(x.valor)).join(', ');
    return 'Precios referenciales, te confirmamos stock por WhatsApp';
  });
  desde = computed(() => (this.f().pagina - 1) * 24 + 1);
  hasta = computed(() => (this.f().pagina - 1) * 24 + this.items().length);
  paginas = computed(() => {
    const n = this.r()?.paginas ?? 1;
    const p = this.f().pagina;
    const ini = Math.max(1, Math.min(p - 2, n - 4));
    return Array.from({ length: Math.min(5, n) }, (_, i) => ini + i);
  });

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroy)).subscribe((p) => {
      const f = filtrosDesdeParams(p);
      const antes = this.f();
      this.f.set(f);
      const soloVista = JSON.stringify({ ...antes, vista: '' }) === JSON.stringify({ ...f, vista: '' }) && !!this.r();
      if (!soloVista) this.cargar(f);
    });
  }

  private cargar(f: FiltrosCatalogo): void {
    this.sub?.unsubscribe();
    this.cargando.set(true);
    this.error.set(false);
    this.sub = this.api
      .familias(consultaApi(f))
      .pipe(catchError(() => of(null)))
      .subscribe((r) => {
        this.cargando.set(false);
        if (!r) {
          this.error.set(true);
          return;
        }
        this.r.set(r);
        this.items.set(r.items);
        this.paginaMovil.set(f.pagina);
      });
  }

  cargarMas(): void {
    const sig = this.paginaMovil() + 1;
    this.cargando.set(true);
    this.api
      .familias(consultaApi({ ...this.f(), pagina: sig }))
      .pipe(catchError(() => of(null)))
      .subscribe((r) => {
        this.cargando.set(false);
        if (!r) return;
        this.items.set([...this.items(), ...r.items]);
        this.paginaMovil.set(sig);
      });
  }

  cambiar(parcial: Partial<FiltrosCatalogo>, reiniciarPagina = true): void {
    const nuevo = { ...this.f(), ...parcial };
    if (reiniciarPagina) nuevo.pagina = 1;
    this.router.navigate([], { relativeTo: this.route, queryParams: paramsDesdeFiltros(nuevo) });
  }

  pagina(p: number): void {
    this.cambiar({ pagina: p }, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  orden(ev: Event): void {
    this.cambiar({ orden: (ev.target as HTMLSelectElement).value as FiltrosCatalogo['orden'] });
  }

  tiene(lista: Lista, v: string): boolean {
    return this.f()[lista].includes(v);
  }

  alternar(lista: Lista, v: string): void {
    const actual = this.f()[lista];
    this.cambiar({ [lista]: actual.includes(v) ? actual.filter((x) => x !== v) : [...actual, v] });
  }

  precioCambio(campo: 'precioMin' | 'precioMax', ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    const n = v === '' ? null : Math.max(0, Math.round(Number(v)));
    this.cambiar({ [campo]: Number.isFinite(n as number) ? n : null });
  }

  limpiar(): void {
    const f = this.f();
    this.cambiar({ ...FILTROS_VACIOS, categoria: f.categoria, q: f.q, vista: f.vista, orden: f.orden });
  }

  textoLargo(v: string): string {
    return this.r()?.conteos?.largos?.find((l) => l.valor === v)?.texto ?? `${v} m`;
  }

  eq(a: string, b: string): boolean {
    return (a || '').toLowerCase() === (b || '').toLowerCase();
  }
}
