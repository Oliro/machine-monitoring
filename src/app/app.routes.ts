import { Routes } from '@angular/router';
import { DashboardComponent } from './authenticated/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        component: DashboardComponent
      },
];
