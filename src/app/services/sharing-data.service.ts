import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';


interface ProductEvent{
  product: Product;
  qcompras: number;
}

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {


  moveCategory: string | null = null;

  private _idProductEventEmitter: EventEmitter<number> = new EventEmitter();
  private _productEventEmitter: EventEmitter<ProductEvent> = new EventEmitter();
  private _openEventEmitter: EventEmitter<void> = new EventEmitter();
  private _moreTotalEvenEmitter: EventEmitter<number> = new EventEmitter();
  private _scrollMapEventEmitter: EventEmitter<void> = new EventEmitter();
  private _homeEventEmitter: EventEmitter<void> = new EventEmitter();
  private _subEventEmitter: EventEmitter<string[]> = new EventEmitter();
  private _searchEventEmitter: EventEmitter<string> = new EventEmitter();
  private _getProduct: EventEmitter<Product[]> = new EventEmitter();
  private _closenav: EventEmitter<void> = new EventEmitter();

  constructor() { }

  get closenav(): EventEmitter<void>{
    return this._closenav;
  }
  get productEventEmitter(): EventEmitter<ProductEvent>{
    return this._productEventEmitter;
  }
  get idProductEventEmitter(): EventEmitter<number>{
    return this._idProductEventEmitter;
  }
  get openEventEmitter():EventEmitter<void>{
    return this._openEventEmitter;
  }
  get moreTotalEventEmitter(): EventEmitter<number>{
    return this._moreTotalEvenEmitter;
  }
  get scrollMapEventEmitter(): EventEmitter<void>{
    return this._scrollMapEventEmitter;
  }
  get homeEventEmitter(): EventEmitter<void>{
    return this._homeEventEmitter;
  }

  get subEventEmitter(): EventEmitter<string[]>{
    return this._subEventEmitter;
  }
  get searchEventEmitter(): EventEmitter<string>{
    return this._searchEventEmitter;
  }
  get getProduct(): EventEmitter<Product[]>{
    return this._getProduct;
  }
}
