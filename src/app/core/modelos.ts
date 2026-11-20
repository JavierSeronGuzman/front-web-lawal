export interface Familia {
  id: number;
  nombre: string;
  categoria: string;
  subtipo: string | null;
  medidas: number;
  unidad_medidas: 'largos' | 'medidas';
  medida: string;
  desde: number;
  precio_normal: number | null;
  oferta: boolean;
  alguna_oferta: boolean;
  imagen: string | null;
  producto_id: number;
  slug: string;
  disponible: boolean;
}

export interface Conteo {
  valor: string;
  n: number;
  texto?: string;
}

export interface RespuestaFamilias {
  items: Familia[];
  total: number;
  pagina: number;
  por_pagina: number;
  paginas: number;
  conteos: {
    categorias: Conteo[];
    chips_por: 'categoria' | 'subtipo';
    chips: Conteo[];
    chips_total: number;
    madera: boolean;
    tipos: Conteo[];
    escuadrias: Conteo[];
    largos: Conteo[];
    ofertas: number;
    precio_min: number;
    precio_max: number;
  };
}

export interface Medida {
  id: number;
  etiqueta: string;
  precio: number;
  precio_normal: number | null;
  slug: string;
  imagen: string | null;
}

export interface Ficha {
  disponible: boolean;
  solicitado_id: number;
  id?: number;
  slug?: string;
  nombre?: string;
  nombre_producto?: string;
  descripcion?: string;
  categoria?: string | null;
  categoria_madre?: string;
  codigo?: string;
  medida?: string;
  precio?: number;
  precio_normal?: number | null;
  oferta?: boolean;
  imagen?: string | null;
  familia?: { id: number; nombre: string };
  medidas?: Medida[];
  relacionados: Familia[];
}

export interface CategoriaMenu {
  nombre: string;
  n: number;
  hijas: { nombre: string; n: number }[];
}

export interface CategoriaDestacada {
  nombre: string;
  imagen: string | null;
  familias: number;
}

export interface ImagenWeb {
  id: number;
  img: string;
  categoria?: string | null;
}
