import { ChangeDetectionStrategy, Component, HostListener, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AVISO_PRECIO } from '../config/tienda';
import { CotizacionService } from '../core/cotizacion.service';
import { conPor, formatoPrecio, rutaProducto } from '../core/formato';
import { Entrega } from '../core/whatsapp';
import { IconoComponent } from '../ui/icono.component';
import { ImagenProductoComponent } from '../ui/imagen-producto.component';

/** "Tu cotización": cantidades, despacho o retiro, total, vista previa y envío por wa.me (O5). */
@Component({
  selector: 'app-cotizacion-panel',
  standalone: true,
  imports: [RouterLink, IconoComponent, ImagenProductoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cot.abierta()) {
      <div class="velo" (click)="cerrar()"></div>
      <aside class="panel-cot" role="dialog" aria-modal="true" aria-labelledby="titulo-cot">
        <div class="panel-cab">
          <button type="button" class="icono-btn solo-movil" aria-label="Volver" (click)="cerrar()">
            <app-icono nombre="chevron-left" [tam]="22" />
          </button>
          <div class="panel-titulo">
            <h2 id="titulo-cot">Tu cotización</h2>
            <span>{{ cot.cantidadProductos() }} {{ cot.cantidadProductos() === 1 ? 'producto' : 'productos' }}</span>
          </div>
          <button type="button" class="icono-btn" aria-label="Cerrar" (click)="cerrar()"><app-icono nombre="x" [tam]="22" /></button>
        </div>

        @if (!cot.items().length) {
          <div class="panel-vacio">
            <app-icono nombre="cart" [tam]="40" [grosor]="1.5" />
            <p>Todavía no agregas productos.</p>
            <a class="btn btn-azul" routerLink="/catalog" (click)="cerrar()">Ver catálogo</a>
          </div>
        } @else {
          <div class="panel-cuerpo">
            <ul class="lineas">
              @for (i of cot.items(); track i.id) {
                <li class="linea">
                  <a class="linea-foto" [routerLink]="ruta(i.id, i.slug)" (click)="cerrar()">
                    <app-imagen-producto [src]="i.imagen" [alt]="i.nombre" />
                  </a>
                  <div class="linea-info">
                    <div class="linea-top">
                      <a class="linea-nombre" [routerLink]="ruta(i.id, i.slug)" (click)="cerrar()">{{ por(i.nombre) }}</a>
                      <button type="button" class="icono-btn quitar" [attr.aria-label]="'Quitar ' + i.nombre" (click)="cot.quitar(i.id)">
                        <app-icono nombre="trash" [tam]="18" />
                      </button>
                    </div>
                    <span class="linea-medida">{{ i.medida ? i.medida + ' · ' : '' }}{{ precio(i.precio) }} c/u</span>
                    <div class="linea-bottom">
                      <div class="stepper" role="group" [attr.aria-label]="'Cantidad de ' + i.nombre">
                        <button type="button" aria-label="Menos" (click)="cot.cambiarCantidad(i.id, i.cantidad - 1)" [disabled]="i.cantidad <= 1">
                          <app-icono nombre="minus" [tam]="16" />
                        </button>
                        <input type="number" min="1" inputmode="numeric" [value]="i.cantidad" (change)="cantidad(i.id, $event)" aria-label="Cantidad" />
                        <button type="button" aria-label="Más" (click)="cot.cambiarCantidad(i.id, i.cantidad + 1)">
                          <app-icono nombre="plus" [tam]="16" />
                        </button>
                      </div>
                      <strong>{{ precio(i.precio * i.cantidad) }}</strong>
                    </div>
                  </div>
                </li>
              }
            </ul>
          </div>

          <div class="panel-pie">
            <div class="entregas" role="radiogroup" aria-label="Entrega">
              @for (e of entregas; track e.valor) {
                <button
                  type="button"
                  role="radio"
                  class="entrega"
                  [class.activa]="cot.entrega() === e.valor"
                  [attr.aria-checked]="cot.entrega() === e.valor"
                  (click)="cot.elegirEntrega(e.valor)"
                >
                  <span class="radio"></span>{{ e.texto }}
                </button>
              }
            </div>
            <div class="total">
              <span>Total estimado</span>
              <strong>{{ precio(cot.total()) }}</strong>
            </div>
            <p class="aviso-precio">{{ aviso }}</p>
            @if (cot.mensaje()) {
              <div class="preview" data-test="preview">
                <strong>Se abrirá WhatsApp con este mensaje:</strong>
                <pre>{{ cot.mensaje() }}</pre>
              </div>
            }
            <button
              type="button"
              class="btn btn-verde btn-ancho"
              data-test="enviar"
              [disabled]="!puedeEnviar()"
              (click)="enviar()"
            >
              <app-icono nombre="whatsapp" [tam]="18" />
              {{ cot.entrega() ? 'Enviar cotización por WhatsApp' : 'Elige despacho o retiro' }}
            </button>
            <button type="button" class="btn btn-gris btn-ancho" (click)="cerrar()">Seguir comprando</button>
          </div>
        }
      </aside>
    }
  `,
})
export class CotizacionPanelComponent {
  cot = inject(CotizacionService);
  aviso = AVISO_PRECIO;
  precio = formatoPrecio;
  por = conPor;
  entregas: { valor: Entrega; texto: string }[] = [
    { valor: 'despacho', texto: 'Despacho a domicilio' },
    { valor: 'retiro', texto: 'Retiro en tienda' },
  ];
  puedeEnviar = computed(() => !!this.cot.entrega() && this.cot.items().length > 0);

  ruta(id: number, slug: string): string {
    return rutaProducto(id, slug);
  }

  cantidad(id: number, ev: Event): void {
    this.cot.cambiarCantidad(id, Number((ev.target as HTMLInputElement).value));
  }

  enviar(): void {
    const link = this.cot.link();
    if (link) window.open(link, '_blank', 'noopener');
  }

  @HostListener('document:keydown.escape')
  cerrar(): void {
    this.cot.abierta.set(false);
  }
}
