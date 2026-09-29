import { Routes } from '@angular/router';

export const SPECIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/species-list/species-list.component').then(
        (m) => m.SpeciesListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/species-detail/species-detail.component').then(
        (m) => m.SpeciesDetailComponent
      ),
  },
];
