import { Routes } from '@angular/router';
import { ProductFormComponent } from '@features/products/product-form/product-form.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { roleGuard } from './guards/role.guard';
import { HeaderComponent } from './layout/header/header.component';
import SupplierListComponent from './modules/suppliers/supplier-list/supplier-list.component';
import { PresentationsComponent } from './modules/presentations/presentations.component';

export const routes: Routes = [
      {
        path:'auth',
        loadChildren: () => import('./auth/auth.route')
      },
      {
        path:'products',
        component:HeaderComponent,
        // canActivate:[authGuardGuard],
        children:
        [
          { path: '',  redirectTo: 'products',  pathMatch: 'full'},
          {
            path: 'products',
            loadComponent: () =>
            import('@features/products/products.component').then(m => m.ProductsComponent),
          },
          {
            path: 'ProductActions',
            component: ProductFormComponent,
            // canActivate: [roleGuard],
            data: { roles: ['Admin'] } // formulario standalone
          },
          {
            path: 'suplierActions',
            component: SupplierListComponent,
            // canActivate: [roleGuard],
            data: { roles: ['Admin'] } // formulario standalone
          },
          {
            path: 'presentationactions',
            component: PresentationsComponent,
            // canActivate: [roleGuard],
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
          },
          {
            path: 'lotactions',
            data: { roles: ['Admin'] },
            loadComponent: () => import('./modules/lots/lot-list/lot-list.component')
          },
       {
            path:'supplieractions',
            data: { roles: ['Admin'] },
            loadComponent: () => import('./modules/suppliers/supplier-list/supplier-list.component')
          },
          {    
            path:'useractions',    
            data: { roles: ['Admin'] },    
            loadComponent: () => import('./modules/users/users-list/users-list.component')    
          }  
        ]
      }
      ,
      { path:'',redirectTo: 'products', pathMatch:'full' },
      { path:'**', redirectTo: 'products',pathMatch:'full' }
];

export default routes;
