import { FILTROS_VACIOS, consultaApi, filtrosDesdeParams, paramsDesdeFiltros } from './filtros';

describe('Filtros del catálogo en la URL (PRD 13)', () => {
  it('ida y vuelta: los filtros viven en la URL', () => {
    const params = {
      categoria: 'Maderas',
      sub: 'Pino',
      tipo: 'Pino Cepillado',
      escuadria: '2x3,2x4',
      largo: '3.20',
      pmin: '1000',
      pmax: '45000',
      ofertas: '1',
      orden: 'precio',
      pagina: '2',
    };
    const f = filtrosDesdeParams(params);
    expect(f.escuadria).toEqual(['2x3', '2x4']);
    expect(f.largo).toEqual(['3.20']);
    expect(f.ofertas).toBeTrue();
    expect(f.pagina).toBe(2);
    expect(paramsDesdeFiltros(f)).toEqual(params);
  });

  it('sin filtros la URL queda limpia y los valores raros se ignoran', () => {
    expect(paramsDesdeFiltros(FILTROS_VACIOS)).toEqual({});
    const f = filtrosDesdeParams({ orden: 'cualquiera', pagina: '-3', pmin: 'abc' });
    expect(f.orden).toBe('destacados');
    expect(f.pagina).toBe(1);
    expect(f.precioMin).toBeNull();
  });

  it('arma la consulta al backend (largo 4 m)', () => {
    const q = consultaApi(filtrosDesdeParams({ categoria: 'Maderas', largo: '4.00' }));
    expect(q['categoria']).toBe('Maderas');
    expect(q['largo']).toBe('4.00');
    expect(q['pagina']).toBe(1);
  });
});
