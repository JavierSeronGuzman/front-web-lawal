import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabeceraComponent } from './layout/cabecera.component';
import { PieComponent } from './layout/pie.component';
import { CotizacionPanelComponent } from './layout/cotizacion-panel.component';
import { AvisoComponent } from './layout/aviso.component';
import { IconoComponent } from './ui/icono.component';
import { linkWhatsApp } from './core/whatsapp';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CabeceraComponent, PieComponent, CotizacionPanelComponent, AvisoComponent, IconoComponent],
  template: `
    <app-cabecera />
    <main><router-outlet /></main>
    <app-pie />
    <app-cotizacion-panel />
    <app-aviso />
    <a class="wa-flotante solo-movil" [href]="wa" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
      <app-icono nombre="whatsapp" [tam]="28" />
    </a>
  `,
})
export class AppComponent {
  wa = linkWhatsApp('Hola Lawal, quiero cotizar.');
}
