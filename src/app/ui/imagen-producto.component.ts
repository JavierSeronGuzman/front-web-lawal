import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/** Foto del producto o, si no tiene (o falla), el reemplazo con el logo de Lawal y "Sin foto" (O6). */
@Component({
  selector: 'app-imagen-producto',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src() && !fallo()) {
      <img [src]="src()" [alt]="alt()" loading="lazy" (error)="fallo.set(true)" />
    } @else {
      <div class="sin-foto" role="img" [attr.aria-label]="alt() + ' (sin foto)'">
        <img src="Logoblanco3.png" alt="" />
        <span>Sin foto</span>
      </div>
    }
  `,
  styles: [
    `:host{display:block;position:relative;width:100%;height:100%;background:var(--azul-foto);overflow:hidden}
     img{width:100%;height:100%;object-fit:cover;display:block}
     .sin-foto{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#fff;opacity:.85}
     .sin-foto img{width:46%;height:auto;object-fit:contain;opacity:.55}
     .sin-foto span{font-size:13px;font-weight:600;letter-spacing:.02em}`,
  ],
})
export class ImagenProductoComponent {
  src = input<string | null | undefined>(null);
  alt = input<string>('');
  fallo = signal(false);
}
