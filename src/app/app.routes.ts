import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio.component';
import { CatalogoComponent } from './paginas/catalogo.component';
import { ProductoComponent } from './paginas/producto.component';
import { NosotrosComponent } from './paginas/nosotros.component';

export const routes: Routes = [
  { path: '', component: InicioComponent, title: 'Lawal Constructor · Barraca de maderas en Puerto Montt' },
  { path: 'catalog', component: CatalogoComponent, title: 'Catálogo · Lawal Constructor' },
  { path: 'producto/:idslug', component: ProductoComponent },
  { path: 'nosotros', component: NosotrosComponent, title: 'Nosotros · Lawal Constructor' },
  // Rutas antiguas: /product no llevaba id (pasaba el nombre por estado interno) → catálogo.
  { path: 'product', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'pago', redirectTo: '', pathMatch: 'full' },
  { path: 'loader', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
