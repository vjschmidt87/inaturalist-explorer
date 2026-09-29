import { Routes } from '@angular/router';

export const OBSERVATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/observation-list/observation-list.component').then(
        (m) => m.ObservationListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/observation-detail/observation-detail.component').then(
        (m) => m.ObservationDetailComponent
      ),
  },
];
