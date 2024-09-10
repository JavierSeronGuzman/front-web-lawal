import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category.component';
import { PayComponent } from './components/pay/pay.component';
import { OnlyProductComponent } from './components/only-product/only-product.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path:'catalog', component: CategoryComponent},
    {path:'pago', component: PayComponent},
    {path:'product', component: OnlyProductComponent}
];
