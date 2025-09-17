import { Routes } from '@angular/router';
// import { authGuardGuard } from './guards/auth-guard.guard';

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
        // canActivate: [authGuardGuard],
        loadComponent: () => import('./features/checkout/checkout.component')
    },
    { path:'',redirectTo: 'products', pathMatch:'full' },
    { path:'**', redirectTo: 'products',pathMatch:'full' }
];
