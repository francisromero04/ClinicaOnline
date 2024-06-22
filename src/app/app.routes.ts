import { Routes } from '@angular/router';
import {canActivate,redirectUnauthorizedTo,redirectLoggedInTo } from "@angular/fire/auth-guard"

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
      path: "login",
      loadComponent: () => import("./componentes/login/login.component"),
    },
    {
      path: "home",
      loadComponent: () => import("./componentes/home/home.component"),
      ...canActivate(()=> redirectUnauthorizedTo(['/login'])),
    },
    {
      path: "error",
      loadComponent: () => import("./componentes/error/error.component"),
    },
    {
     path: "eleccionregistro",
     loadComponent: () => import("./componentes/registros/eleccionregistro/eleccionregistro.component")
    },
    {
      path: "**", //¿estoy en cualquier ruta?
      redirectTo: 'error',
    }
];
