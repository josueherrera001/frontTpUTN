import { Routes } from '@angular/router';
import { ProductFormComponent } from '@features/products/product-form/product-form.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { roleGuard } from './guards/role.guard';
import { HeaderComponent } from './layout/header/header.component';

export const routes: Routes = [
      {
        path:'auth',
        loadChildren: () => import('./auth/auth.route')
      },
      {
        path:'products',
        component:HeaderComponent,
        canActivate:[authGuardGuard],
        children:
        [
          { path: '',  redirectTo: 'products',  pathMatch: 'full'},
          {
            path: 'products',
            loadComponent: () =>
            import('@features/products/products.component').then(m => m.ProductsComponent),
          },
          {
            path: 'products/new',
            component: ProductFormComponent,
            canActivate: [roleGuard],
            data: { roles: ['Admin'] } // formulario standalone
          },
          {
            path: 'products/:id',
            loadComponent: () => import('@features/products/details/details.component').then(m => m.DetailsComponent), // detalles standalone
          },
          {
            path:'checkout',
            canActivate: [authGuardGuard],
            loadComponent: () => import('./features/checkout/checkout.component')
          },
          {
            path:'categoryactions',
            // canActivate: [roleGuard,authGuardGuard],
            data: { roles: ['Admin'] },
            loadComponent: () => import('./modules/categories/category-list/category-list.component') // componente standalone
          }
        ]
      }
      ,
      { path:'',redirectTo: 'products', pathMatch:'full' },
      { path:'**', redirectTo: 'products',pathMatch:'full' }
];

export default routes;
