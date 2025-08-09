import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'products', 
        loadChildren: () => import('./features/products/product.route'),
    },
    {
        path:'auth',
        loadChildren: () => import('./auth/auth.route')
    },
    {
        path:'checkout', 
        loadComponent: () => import('./features/checkout/checkout.component'),
    },
    { path:'',redirectTo: 'products', pathMatch:'full' },
    { path:'**', redirectTo: 'products',pathMatch:'full' }
];
