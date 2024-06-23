import { Routes } from '@angular/router';
import { AdministradorComponent } from './administrador/administrador.component';

export const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdministradorComponent,
  },
  {
    path: 'admin/registrarAdministrador',
    loadComponent: () => import('../registros/registroadministrador/registroadministrador.component'),
  },
  {
    path: 'admin/gestionEspecialistas',
    loadComponent: () => import('./gestion-de-especialistas/gestion-de-especialistas.component'),
  }
];

export default routes; //tiene dentro rutas de mis juegos

