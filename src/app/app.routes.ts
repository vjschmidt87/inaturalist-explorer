import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/home/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'observations',
    loadChildren: () =>
      import('@features/observations/observations.routes').then(
        (m) => m.OBSERVATION_ROUTES
      ),
  },
  {
    path: 'species',
    loadChildren: () =>
      import('@features/species/species.routes').then(
        (m) => m.SPECIES_ROUTES
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('@features/users/users.routes').then(
        (m) => m.USER_ROUTES
      ),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('@features/explore/pages/explore-map/explore-map.component').then(
        (m) => m.ExploreMapComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
