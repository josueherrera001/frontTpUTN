import { Routes } from '@angular/router';
import { ProductFormComponent } from '@features/products/product-form/product-form.component';
// import { authGuardGuard } from './guards/auth-guard.guard';

export const routes: Routes = [
      {
        path: 'products',
        loadComponent: () =>
        import('@features/products/products.component').then(m => m.ProductsComponent),
      },
      {
        path: 'products/new',
        component: ProductFormComponent, // formulario standalone
      },
      {
        path: 'products/:id',
        loadComponent: () => import('@features/products/details/details.component').then(m => m.DetailsComponent), // detalles standalone
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

export default routes;