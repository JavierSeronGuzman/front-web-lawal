import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoriaDestacada, CategoriaMenu, Ficha, ImagenWeb, RespuestaFamilias } from './modelos';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private menu$?: Observable<CategoriaMenu[]>;

  familias(params: Record<string, string | number | boolean | undefined | null>): Observable<RespuestaFamilias> {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== false) p = p.set(k, String(v));
    }
    return this.http.get<RespuestaFamilias>(`${API}/familias`, { params: p });
  }

  ficha(id: number): Observable<Ficha> {
    return this.http.get<Ficha>(`${API}/productos/${id}`);
  }

  categorias(): Observable<CategoriaMenu[]> {
    if (!this.menu$) {
      this.menu$ = this.http.get<CategoriaMenu[]>(`${API}/categorias`).pipe(shareReplay(1));
    }
    return this.menu$;
  }

  destacadas(): Observable<CategoriaDestacada[]> {
    return this.http.get<CategoriaDestacada[]>(`${API}/categorias-destacadas`);
  }

  banners(): Observable<ImagenWeb[]> {
    return this.http.get<ImagenWeb[]>(`${API}/banners`);
  }

  anuncios(): Observable<ImagenWeb[]> {
    return this.http.get<ImagenWeb[]>(`${API}/anuncios`);
  }
}
