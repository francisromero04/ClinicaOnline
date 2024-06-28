import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'opciones',
    loadComponent: () => import("./misturnosgeneral/misturnosgeneral.component")
  }
];

export default routes;

