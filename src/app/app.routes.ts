/**
 * ======================================
 * PROG2005 Assignment 3
 * App Routes - Standalone Component Routing
 * Author: Hanyu Man (whw343)
 * ======================================
 */

import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
  },
  {
    path: '**',
    redirectTo: '',
  }
];

export { routes };
