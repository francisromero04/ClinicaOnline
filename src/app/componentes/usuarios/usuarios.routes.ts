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
  },
  {
    path: 'admin/miperfil',
    loadComponent: () => import('../miperfil/miperfil.component'),
  },
  {
    path: 'admin/seccionturnos',
    loadComponent: () => import('../usuarios/seccionturnosadmin/seccionturnosadmin.component'),
  },
  {
    path: 'admin/solicitarturnoadm',
    loadComponent: () => import('../gestionturnos/gestionturnos.component') //solicitar turno
  },
  {
    path: 'admin/usuariospacientes',
    loadComponent: () => import('../usuarios-pacientes/usuarios-pacientes.component')
  },
  {
    path: 'admin/graficos',
    loadComponent: () => import('./graficos/graficos.component')
  },
];

export default routes;

