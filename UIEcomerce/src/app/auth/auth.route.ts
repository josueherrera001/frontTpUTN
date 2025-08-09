import { Routes } from '@angular/router';

 const routes: Routes = [
    {
        path:'', 
        loadComponent: () => import('./login/login.component'),
    },
    {
        path:'register', 
        loadComponent: () => import('./register/register.component'),
    },
];
export default routes;