/**
 * ======================================
 * PROG2005 Assignment 3
 * Tabs Page - Main Tab Navigation Container (Standalone)
 * Author: Hanyu Man (whw343)
 * ======================================
 *
 * Ionic Tabs layout with 4 tabs:
 * Tab 1: Inventory List + Search
 * Tab 2: Add Item + Featured Items
 * Tab 3: Update + Delete
 * Tab 4: Privacy & Security
 */

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'inventory',
    loadComponent: () => import('../inventory/inventory.page').then(m => m.InventoryPage),
  },
  {
    path: 'add-item',
    loadComponent: () => import('../add-item/add-item.page').then(m => m.AddItemPage),
  },
  {
    path: 'update-delete',
    loadComponent: () => import('../update-delete/update-delete.page').then(m => m.UpdateDeletePage),
  },
  {
    path: 'privacy-security',
    loadComponent: () => import('../privacy-security/privacy-security.page').then(m => m.PrivacySecurityPage),
  },
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full',
  }
];

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class TabsPage {}
