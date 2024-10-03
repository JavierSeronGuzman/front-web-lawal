import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { itemReducer } from './store/items.reducers';
import { provideEffects } from '@ngrx/effects';
import { productsReducer } from './store/products.reducer';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideStore({ items: itemReducer,
    products: productsReducer}), provideEffects(
  ), provideHttpClient()]
};
