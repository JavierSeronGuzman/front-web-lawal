import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { IconoComponent } from './icono.component';

/** Fila con desplazamiento horizontal (flechas en el computador, deslizar en el teléfono). */
@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="carrusel">
      <button type="button" class="flecha izq" aria-label="Anterior" (click)="mover(-1)">
        <app-icono nombre="chevron-left" />
      </button>
      <div class="pista" #pista><ng-content /></div>
      <button type="button" class="flecha der" aria-label="Siguiente" (click)="mover(1)">
        <app-icono nombre="chevron-right" />
      </button>
    </div>
  `,
})
export class CarruselComponent {
  pista = viewChild.required<ElementRef<HTMLElement>>('pista');

  mover(dir: number): void {
    const el = this.pista().nativeElement;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  }
}
