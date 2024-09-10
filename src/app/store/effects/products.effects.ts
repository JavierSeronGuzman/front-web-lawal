import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, exhaustMap, map } from 'rxjs';
import { findAll, load } from '../products.actions';
import { ProductService } from '../../services/product.service';

@Injectable()
export class ProductsEffects {

  constructor(
    private actions$: Actions,
    private service: ProductService
  ) {}

  loadProduct$ = createEffect(
    () => this.actions$.pipe(ofType(load),exhaustMap(()=>this.service.getProducts())).pipe(map(products => (findAll({products}))),catchError(()=>EMPTY))
  );
}
