import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TELEFONO_TEXTO, TIENDA } from '../config/tienda';
import { ApiService } from '../core/api.service';
import { linkWhatsApp } from '../core/whatsapp';
import { IconoComponent } from '../ui/icono.component';

@Component({
  selector: 'app-pie',
  standalone: true,
  imports: [RouterLink, IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="pie">
      <div class="contenedor pie-in">
        <div class="pie-marca">
          <img src="logo-lawal-constructor.png" alt="Lawal Constructor" />
          <p>{{ tienda.descripcion }}</p>
        </div>
        <div class="pie-cols">
          <div>
            <h4>Categorías</h4>
            @for (c of menu().slice(0, 4); track c.nombre) {
              <a [routerLink]="'/catalog'" [queryParams]="{ categoria: c.nombre }">{{ c.nombre }}</a>
            }
            <a routerLink="/catalog">Ver todas</a>
          </div>
          <div>
            <h4>Información</h4>
            <a routerLink="/nosotros" fragment="como-cotizar">Cómo cotizar</a>
            <a routerLink="/nosotros" fragment="despacho">Despacho y retiro</a>
            <a routerLink="/nosotros">Nosotros</a>
            <a routerLink="/nosotros" fragment="pago">Medios de pago</a>
          </div>
          <div class="pie-visita">
            <h4>Visítanos</h4>
            <span><app-icono nombre="pin" [tam]="16" /> {{ tienda.direccion }}</span>
            <span><app-icono nombre="clock" [tam]="16" /> {{ tienda.horario }}</span>
            <a [href]="wa" target="_blank" rel="noopener"><app-icono nombre="phone" [tam]="16" /> {{ telefono }}</a>
            <a [href]="'mailto:' + tienda.correo"><app-icono nombre="mail" [tam]="16" /> {{ tienda.correo }}</a>
          </div>
        </div>
      </div>
      <div class="contenedor pie-base">
        <span>© {{ anio }} {{ tienda.nombre }}</span>
        <span class="redes">
          @for (r of tienda.redes; track r.nombre; let ultimo = $last) {
            <a [href]="r.url" target="_blank" rel="noopener">{{ r.nombre }}</a>@if (!ultimo) { · }
          }
        </span>
      </div>
    </footer>
  `,
})
export class PieComponent {
  private api = inject(ApiService);
  tienda = TIENDA;
  telefono = TELEFONO_TEXTO;
  wa = linkWhatsApp();
  anio = new Date().getFullYear();
  menu = toSignal(this.api.categorias().pipe(catchError(() => of([]))), { initialValue: [] });
}
