import { WHATSAPP_NUMERO } from '../config/tienda';
import { formatoPrecio } from './formato';

export type Entrega = 'despacho' | 'retiro';

export interface LineaMensaje {
  cantidad: number;
  nombre: string;
  medida: string;
}

export const TEXTO_ENTREGA: Record<Entrega, string> = {
  despacho: 'Despacho a domicilio',
  retiro: 'Retiro en tienda',
};

/** Mensaje de la cotización, con el formato exacto de la maqueta (PRD 13). */
export function mensajeCotizacion(lineas: LineaMensaje[], total: number, entrega: Entrega): string {
  const filas = lineas.map((l) => `${l.cantidad} × ${[l.nombre, l.medida].filter((x) => !!x).join(' ')}`);
  return [
    'Hola Lawal, quiero cotizar:',
    ...filas,
    `Total estimado: ${formatoPrecio(total)} · ${TEXTO_ENTREGA[entrega]}`,
  ].join('\n');
}

/** Consulta desde la ficha. */
export function mensajeConsulta(nombre: string, medida: string): string {
  return `Hola Lawal, quiero consultar por: ${[nombre, medida].filter((x) => !!x).join(' ')}`;
}

/** Siempre wa.me, con el número de la constante. */
export function linkWhatsApp(texto?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}
