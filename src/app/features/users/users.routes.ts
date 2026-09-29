import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: ':login',
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
  },
];
