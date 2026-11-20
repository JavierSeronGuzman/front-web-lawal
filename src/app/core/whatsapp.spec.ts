import { WHATSAPP_NUMERO } from '../config/tienda';
import { linkWhatsApp, mensajeConsulta, mensajeCotizacion } from './whatsapp';

// Mensaje de la maqueta (propuesta-web.pdf, página "Cotización"), letra por letra.
const MENSAJE_MAQUETA = [
  'Hola Lawal, quiero cotizar:',
  '10 × Polín impregnado 3-4 x 2,60 m',
  '2 × Pellet Pellet Sur Saco 15 kg',
  '1 × Iniciador de fuego Caja de pastillas',
  'Total estimado: $41.780 · Despacho a domicilio',
].join('\n');

const LINEAS = [
  { cantidad: 10, nombre: 'Polín impregnado', medida: '3-4 x 2,60 m', precio: 2800 },
  { cantidad: 2, nombre: 'Pellet Pellet Sur', medida: 'Saco 15 kg', precio: 5490 },
  { cantidad: 1, nombre: 'Iniciador de fuego', medida: 'Caja de pastillas', precio: 2800 },
];

describe('Mensaje de WhatsApp (PRD 13)', () => {
  it('con los 3 productos de la maqueta y despacho es idéntico al de la maqueta', () => {
    const total = LINEAS.reduce((s, l) => s + l.cantidad * l.precio, 0);
    expect(total).toBe(41780);
    expect(mensajeCotizacion(LINEAS, total, 'despacho')).toBe(MENSAJE_MAQUETA);
  });

  it('no lleva precio unitario y con retiro dice "Retiro en tienda"', () => {
    const m = mensajeCotizacion(LINEAS, 41780, 'retiro');
    expect(m).not.toContain('c/u');
    expect(m.split('\n')[1]).toBe('10 × Polín impregnado 3-4 x 2,60 m');
    expect(m.endsWith('Total estimado: $41.780 · Retiro en tienda')).toBeTrue();
  });

  it('la consulta desde la ficha', () => {
    expect(mensajeConsulta('Pino 2x10', '4 m')).toBe('Hola Lawal, quiero consultar por: Pino 2x10 4 m');
  });

  it('el enlace usa wa.me y el número de la constante', () => {
    expect(WHATSAPP_NUMERO).toBe('56967453739');
    const link = linkWhatsApp(MENSAJE_MAQUETA);
    expect(link.startsWith(`https://wa.me/${WHATSAPP_NUMERO}?text=`)).toBeTrue();
    expect(decodeURIComponent(link.split('?text=')[1])).toBe(MENSAJE_MAQUETA);
    expect(link).not.toContain('web.whatsapp.com');
  });
});
