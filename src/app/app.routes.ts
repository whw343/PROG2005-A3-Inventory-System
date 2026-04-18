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
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'inventory',
        loadComponent: () => import('./pages/inventory/inventory.page').then(m => m.InventoryPage),
      },
      {
        path: 'add-item',
        loadComponent: () => import('./pages/add-item/add-item.page').then(m => m.AddItemPage),
      },
      {
        path: 'update-delete',
        loadComponent: () => import('./pages/update-delete/update-delete.page').then(m => m.UpdateDeletePage),
      },
      {
        path: 'privacy-security',
        loadComponent: () => import('./pages/privacy-security/privacy-security.page').then(m => m.PrivacySecurityPage),
      },
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  }
];

export { routes };
