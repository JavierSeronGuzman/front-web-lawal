import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CotizacionService } from '../core/cotizacion.service';
import { IconoComponent } from '../ui/icono.component';

/** Aviso breve al agregar: no interrumpe la compra. */
@Component({
  selector: 'app-aviso',
  standalone: true,
  imports: [IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="aviso-zona" aria-live="polite">
      @if (cot.aviso(); as a) {
        <div class="aviso" role="status">
          <span class="aviso-ok"><app-icono nombre="check" [tam]="16" [grosor]="3" /></span>
          <div>
            <strong>{{ a.titulo }}</strong>
            <span>{{ a.texto }}</span>
            <button type="button" class="aviso-link" (click)="ver()">Ver cotización →</button>
          </div>
          <button type="button" class="aviso-x" aria-label="Cerrar aviso" (click)="cot.aviso.set(null)">
            <app-icono nombre="x" [tam]="16" />
          </button>
        </div>
      }
    </div>
  `,
})
export class AvisoComponent {
  cot = inject(CotizacionService);
  ver(): void {
    this.cot.aviso.set(null);
    this.cot.abierta.set(true);
  }
}
