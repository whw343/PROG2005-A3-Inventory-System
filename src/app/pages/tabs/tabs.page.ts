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
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class TabsPage {}
