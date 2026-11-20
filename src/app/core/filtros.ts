/** Filtros del catálogo; viven en la URL (PRD 13). */
export interface FiltrosCatalogo {
  categoria: string;
  sub: string;
  q: string;
  tipo: string[];
  escuadria: string[];
  largo: string[];
  precioMin: number | null;
  precioMax: number | null;
  ofertas: boolean;
  orden: 'destacados' | 'precio' | 'precio_desc';
  vista: 'grilla' | 'lista';
  pagina: number;
}

export const FILTROS_VACIOS: FiltrosCatalogo = {
  categoria: '',
  sub: '',
  q: '',
  tipo: [],
  escuadria: [],
  largo: [],
  precioMin: null,
  precioMax: null,
  ofertas: false,
  orden: 'destacados',
  vista: 'grilla',
  pagina: 1,
};

type Params = Record<string, string | string[] | undefined | null>;

function lista(v: string | string[] | undefined | null): string[] {
  if (v === undefined || v === null) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.flatMap((x) => String(x).split(',')).map((x) => x.trim()).filter((x) => !!x);
}

function uno(v: string | string[] | undefined | null): string {
  if (v === undefined || v === null) return '';
  return String(Array.isArray(v) ? v[0] ?? '' : v).trim();
}

function numero(v: string | string[] | undefined | null): number | null {
  const s = uno(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

export function filtrosDesdeParams(p: Params): FiltrosCatalogo {
  const orden = uno(p['orden']);
  return {
    categoria: uno(p['categoria']),
    sub: uno(p['sub']),
    q: uno(p['q']),
    tipo: lista(p['tipo']),
    escuadria: lista(p['escuadria']),
    largo: lista(p['largo']),
    precioMin: numero(p['pmin']),
    precioMax: numero(p['pmax']),
    ofertas: uno(p['ofertas']) === '1',
    orden: orden === 'precio' || orden === 'precio_desc' ? orden : 'destacados',
    vista: uno(p['vista']) === 'lista' ? 'lista' : 'grilla',
    pagina: Math.max(1, numero(p['pagina']) || 1),
  };
}

/** Solo lo que difiere del valor por defecto, para URLs cortas y compartibles. */
export function paramsDesdeFiltros(f: FiltrosCatalogo): Record<string, string> {
  const out: Record<string, string> = {};
  if (f.categoria) out['categoria'] = f.categoria;
  if (f.sub) out['sub'] = f.sub;
  if (f.q) out['q'] = f.q;
  if (f.tipo.length) out['tipo'] = f.tipo.join(',');
  if (f.escuadria.length) out['escuadria'] = f.escuadria.join(',');
  if (f.largo.length) out['largo'] = f.largo.join(',');
  if (f.precioMin !== null) out['pmin'] = String(f.precioMin);
  if (f.precioMax !== null) out['pmax'] = String(f.precioMax);
  if (f.ofertas) out['ofertas'] = '1';
  if (f.orden !== 'destacados') out['orden'] = f.orden;
  if (f.vista !== 'grilla') out['vista'] = f.vista;
  if (f.pagina > 1) out['pagina'] = String(f.pagina);
  return out;
}

/** Parámetros para GET /web/familias. */
export function consultaApi(f: FiltrosCatalogo): Record<string, string | number | boolean | null> {
  return {
    categoria: f.categoria || null,
    sub: f.sub || null,
    q: f.q || null,
    tipo: f.tipo.join(',') || null,
    escuadria: f.escuadria.join(',') || null,
    largo: f.largo.join(',') || null,
    precio_min: f.precioMin,
    precio_max: f.precioMax,
    ofertas: f.ofertas,
    orden: f.orden,
    pagina: f.pagina,
  };
}

export function cantidadFiltrosActivos(f: FiltrosCatalogo): number {
  return (
    f.tipo.length + f.escuadria.length + f.largo.length + (f.precioMin !== null || f.precioMax !== null ? 1 : 0) + (f.ofertas ? 1 : 0)
  );
}
