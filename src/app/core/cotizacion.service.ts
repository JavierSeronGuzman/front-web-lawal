import { Injectable, computed, signal } from '@angular/core';
import { Entrega, linkWhatsApp, mensajeCotizacion } from './whatsapp';
import { conPor } from './formato';

/** Línea de la cotización (carrito local; NO2: no se crea nada en el ERP). */
export interface ItemCotizacion {
  id: number;
  nombre: string;
  medida: string;
  precio: number;
  imagen: string | null;
  slug: string;
  cantidad: number;
}

export interface Aviso {
  titulo: string;
  texto: string;
}

const CLAVE = 'lawal-cotizacion-v1';

function leer(): { items: ItemCotizacion[]; entrega: Entrega | null } {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (d && Array.isArray(d.items)) {
      return { items: d.items, entrega: d.entrega === 'despacho' || d.entrega === 'retiro' ? d.entrega : null };
    }
  } catch {
    /* sin almacenamiento: cotización vacía */
  }
  return { items: [], entrega: null };
}

@Injectable({ providedIn: 'root' })
export class CotizacionService {
  private inicial = leer();
  readonly items = signal<ItemCotizacion[]>(this.inicial.items);
  readonly entrega = signal<Entrega | null>(this.inicial.entrega);
  readonly abierta = signal(false);
  readonly aviso = signal<Aviso | null>(null);
  private timer: ReturnType<typeof setTimeout> | null = null;

  readonly total = computed(() => this.items().reduce((s, i) => s + i.cantidad * i.precio, 0));
  readonly cantidadProductos = computed(() => this.items().length);
  readonly unidades = computed(() => this.items().reduce((s, i) => s + i.cantidad, 0));
  readonly mensaje = computed(() => {
    const e = this.entrega();
    return e ? mensajeCotizacion(this.items(), this.total(), e) : '';
  });
  readonly link = computed(() => (this.mensaje() ? linkWhatsApp(this.mensaje()) : ''));

  agregar(item: Omit<ItemCotizacion, 'cantidad'>, cantidad = 1): void {
    const cant = Math.max(1, Math.floor(cantidad));
    const lista = [...this.items()];
    const i = lista.findIndex((x) => x.id === item.id);
    if (i >= 0) lista[i] = { ...lista[i], ...item, cantidad: lista[i].cantidad + cant };
    else lista.push({ ...item, cantidad: cant });
    this.items.set(lista);
    this.guardar();
    this.mostrarAviso('Agregado a tu cotización', `${cant} × ${conPor([item.nombre, item.medida].filter((x) => !!x).join(' '))}`);
  }

  cambiarCantidad(id: number, cantidad: number): void {
    const c = Math.max(1, Math.floor(Number(cantidad) || 1));
    this.items.set(this.items().map((x) => (x.id === id ? { ...x, cantidad: c } : x)));
    this.guardar();
  }

  quitar(id: number): void {
    this.items.set(this.items().filter((x) => x.id !== id));
    this.guardar();
  }

  elegirEntrega(e: Entrega): void {
    this.entrega.set(e);
    this.guardar();
  }

  vaciar(): void {
    this.items.set([]);
    this.guardar();
  }

  mostrarAviso(titulo: string, texto: string): void {
    this.aviso.set({ titulo, texto });
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.aviso.set(null), 3500);
  }

  private guardar(): void {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ items: this.items(), entrega: this.entrega() }));
    } catch {
      /* modo privado: la cotización vive solo en memoria */
    }
  }
}
