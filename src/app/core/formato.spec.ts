import { conPor, formatoPrecio, idDesdeSegmento, rutaProducto, slugify } from './formato';

describe('Formato (PRD 13)', () => {
  it('precio con punto de miles: $41.780', () => {
    expect(formatoPrecio(41780)).toBe('$41.780');
    expect(formatoPrecio(3000)).toBe('$3.000');
    expect(formatoPrecio(239040)).toBe('$239.040');
    expect(formatoPrecio(1234567)).toBe('$1.234.567');
    expect(formatoPrecio(900)).toBe('$900');
    expect(formatoPrecio(0)).toBe('$0');
  });

  it('slug y link de la ficha /producto/{id}-{slug}', () => {
    expect(slugify('Pino 2x10 4m')).toBe('pino-2x10-4m');
    expect(slugify('Polín impregnado')).toBe('polin-impregnado');
    expect(rutaProducto(94, 'pino-2x10-4m')).toBe('/producto/94-pino-2x10-4m');
  });

  it('el id se toma del inicio del segmento; el slug es decorativo', () => {
    expect(idDesdeSegmento('94-pino-2x10-4m')).toBe(94);
    expect(idDesdeSegmento('94-otro-slug')).toBe(94);
    expect(idDesdeSegmento('94')).toBe(94);
    expect(idDesdeSegmento('pino')).toBeNull();
  });

  it('muestra 2×3 en vez de 2x3 solo en pantalla', () => {
    expect(conPor('Pino cepillado 2x3')).toBe('Pino cepillado 2×3');
  });
});
