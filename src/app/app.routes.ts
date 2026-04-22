import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'setup',
    loadComponent: () => import('./features/setup/setup.component').then(m => m.SetupComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'rutina',
        loadComponent: () => import('./features/routine/routine.component').then(m => m.RoutineComponent)
      },
      {
        path: 'nutricion',
        loadComponent: () => import('./features/nutrition/nutrition.component').then(m => m.NutritionComponent)
      },
      {
        path: 'horario',
        loadComponent: () => import('./features/schedule/schedule.component').then(m => m.ScheduleComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
