import { Routes } from '@angular/router';

 const routes: Routes = [
    {
        path:'', 
        loadComponent: () => import('./products.component').then(m => m.ProductsComponent),
    },
    {
        path:':id', 
        loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent),
    },
];
export default routes;