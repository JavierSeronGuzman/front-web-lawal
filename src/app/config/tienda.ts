// PRD 13: datos fijos de la tienda en un solo lugar (barra superior, beneficios, footer, WhatsApp).

/** Número de WhatsApp en formato internacional, sin "+" ni espacios (para wa.me). */
export const WHATSAPP_NUMERO = '56967453739';
/** El mismo número como se muestra. */
export const TELEFONO_TEXTO = '+56 9 6745 3739';

export const TIENDA = {
  nombre: 'Lawal Constructor',
  despacho: 'Despacho en Puerto Montt, Alerce y alrededores',
  horario: 'Lun a Vie 8:30–18:00 · Sáb 8:30–13:30',
  direccion: 'Av. Gabriela Mistral 967, Alerce, Puerto Montt',
  correo: 'contacto@lawalconstructor.cl',
  descripcion:
    'Barraca de maderas y materiales de construcción en Alerce, Puerto Montt. Cotiza en línea y te confirmamos por WhatsApp.',
  redes: [
    { nombre: 'Instagram', url: 'https://www.instagram.com/maderaslawal/' },
    { nombre: 'Facebook', url: 'https://www.facebook.com/maderaslawal' },
    { nombre: 'TikTok', url: 'https://www.tiktok.com/@maderaslawal' },
  ],
};

export const BENEFICIOS = [
  { icono: 'truck', titulo: 'Despacho a domicilio', texto: 'Puerto Montt y alrededores' },
  { icono: 'store', titulo: 'Retiro en tienda', texto: 'Listo el mismo día' },
  { icono: 'shield', titulo: 'Pago seguro', texto: 'WebPay, transferencia y 12 cuotas' },
  { icono: 'headset', titulo: 'Atención experta', texto: 'Te asesoramos por WhatsApp' },
];

/** Bloques de la ficha (NO1: el pago en línea solo aparece como texto). */
export const BLOQUES_FICHA = [
  { icono: 'truck', titulo: 'Despacho a domicilio', texto: 'Puerto Montt, Alerce y alrededores. Te confirmamos el costo por WhatsApp.' },
  { icono: 'store', titulo: 'Retiro en tienda', texto: 'Listo el mismo día en Av. Gabriela Mistral 967, Alerce.' },
  { icono: 'shield', titulo: 'Pago seguro', texto: 'WebPay, transferencia o hasta 12 cuotas sin interés.' },
];

export const AVISO_PRECIO =
  'Precio referencial. Te confirmamos stock, precio final y costo de despacho por WhatsApp.';

/** Dominio público para el link "Compartir este producto". */
export const DOMINIO_PUBLICO = 'lawalconstructor.cl';
