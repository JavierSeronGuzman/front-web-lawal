import { TIENDA } from './tienda';

// PRD 13, duda 3 resuelta el 2026-11-20: datos del footer confirmados por Javier.
describe('Datos de la tienda (PRD 13)', () => {
  it('el correo es el de la web actual', () => {
    expect(TIENDA.correo).toBe('maderaslawal@hotmail.com');
  });

  it('las redes son las de @maderaslawal', () => {
    expect(TIENDA.redes.map((r) => r.url)).toEqual([
      'https://www.instagram.com/maderaslawal/',
      'https://www.facebook.com/maderaslawal',
      'https://www.tiktok.com/@maderaslawal',
    ]);
  });
});
