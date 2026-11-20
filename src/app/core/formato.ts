/** $41.780 (separador de miles con punto, sin decimales). */
export function formatoPrecio(valor: number | null | undefined): string {
  const n = Math.round(Number(valor) || 0);
  const signo = n < 0 ? '-' : '';
  return `${signo}$${Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/** "Pino 2x10 4m" → "pino-2x10-4m" (igual que el backend). */
export function slugify(texto: string): string {
  const s = (texto || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return s || 'producto';
}

/** Link de la ficha: /producto/{id}-{slug}. */
export function rutaProducto(id: number, slug: string): string {
  return `/producto/${id}-${slug || 'producto'}`;
}

/** Id al inicio del segmento "94-pino-2x10-4m". */
export function idDesdeSegmento(segmento: string | null | undefined): number | null {
  const m = /^(\d+)/.exec(segmento || '');
  return m ? Number(m[1]) : null;
}

/** Solo para mostrar: "2x3" → "2×3" (los datos y el mensaje de WhatsApp no cambian). */
export function conPor(texto: string | null | undefined): string {
  return (texto || '').replace(/(\d)\s*x\s*(\d)/gi, '$1×$2');
}
