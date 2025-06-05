// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent) },
  { path: 'equipo', loadComponent: () => import('./pages/equipo/equipo.component').then(m => m.EquipoComponent) },
  { path: 'que-hacemos', loadComponent: () => import('./pages/que-hacemos/que-hacemos.component').then(m => m.QueHacemosComponent) },
  { path: 'cursos', loadComponent: () => import('./pages/cursos/cursos.component').then(m => m.CursosComponent) },
  { path: 'contacto', loadComponent: () => import('./pages/contacto/contacto.component').then(m => m.ContactoComponent) },
  { path: 'ciencia-ciudadana', loadComponent: () => import('./pages/ciencia-ciudadana/ciencia-ciudadana.component').then(m => m.CienciaCiudadanaComponent) },
  { path: 'graficas-importantes', loadComponent: () => import('./pages/graficas-importantes/graficas-importantes.component').then(m => m.GraficasImportantesComponent) },
];


