import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TELEFONO_TEXTO, TIENDA } from '../config/tienda';
import { linkWhatsApp } from '../core/whatsapp';
import { IconoComponent } from '../ui/icono.component';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [RouterLink, IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contenedor info">
      <h1 class="titulo-pagina">Nosotros</h1>
      <p class="info-lead">
        Maderas Lawal es una empresa familiar pionera en la venta de madera dimensionada en Alerce y Puerto Montt. Desde 2005
        trabajamos pino insigne, oregón y madera impregnada en una gran variedad de medidas y largos, y hoy sumamos más de 100
        productos para todo ámbito de la construcción: tableros, obra gruesa, molduras, fijaciones y ferretería.
      </p>
      <img class="info-foto" src="camiones.jpeg" alt="Despacho de Lawal" loading="lazy" />

      <section id="como-cotizar">
        <h2>Cómo cotizar</h2>
        <ol>
          <li>Busca en el <a routerLink="/catalog">catálogo</a> y elige la medida de cada producto.</li>
          <li>Agrégalo a tu cotización con la cantidad que necesitas.</li>
          <li>En «Mi cotización» elige despacho a domicilio o retiro en tienda.</li>
          <li>Envía la cotización por WhatsApp: te confirmamos stock, precio final y costo de despacho.</li>
        </ol>
      </section>
      <section id="despacho">
        <h2>Despacho y retiro</h2>
        <p>Despachamos en Puerto Montt, Alerce y alrededores; el costo te lo confirmamos por WhatsApp. También puedes retirar el mismo día en {{ tienda.direccion }}.</p>
      </section>
      <section id="pago">
        <h2>Medios de pago</h2>
        <p>WebPay, transferencia o hasta 12 cuotas sin interés. El pago se coordina al confirmar la cotización; la web no cobra en línea.</p>
      </section>
      <section>
        <h2>Visítanos</h2>
        <p><app-icono nombre="pin" [tam]="16" /> {{ tienda.direccion }}<br /><app-icono nombre="clock" [tam]="16" /> {{ tienda.horario }}</p>
        <a class="btn btn-verde" [href]="wa" target="_blank" rel="noopener"><app-icono nombre="whatsapp" [tam]="18" /> {{ telefono }}</a>
      </section>
    </div>
  `,
})
export class NosotrosComponent {
  tienda = TIENDA;
  telefono = TELEFONO_TEXTO;
  wa = linkWhatsApp('Hola Lawal, quiero cotizar.');
}
