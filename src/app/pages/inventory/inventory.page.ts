/**
 * ======================================
 * PROG2005 Assignment 3
 * Inventory Page - List & Search (Tab 1)
 * Author: Hanyu Man (whw343)
 * ======================================
 *
 * Features:
 * - Display all inventory items in a scrollable list
 * - Search items by name (client-side filter)
 * - Pull-to-refresh for data reload
 * - Color-coded stock status badges
 * - Featured item indicators
 * - Help Widget integration
 */

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ApiService } from '../../services/api.service';
import { InventoryItem, StockStatus } from '../../models/inventory.model';
import { HelpWidgetComponent } from '../../components/help-widget/help-widget.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HelpWidgetComponent
  ],
})
export class InventoryPage implements OnInit {
  /** Search form control */
  searchControl = new FormControl('');

  /** Local filtered results signal */
  filteredItems = signal<InventoryItem[]>([]);

  /** Whether search is active */
  isSearching = signal<boolean>(false);

  /** Computed: has results to display */
  hasResults = computed(() => this.filteredItems().length > 0);

  /** Stock status enum for template access */
  StockStatus = StockStatus;

  /** Help widget content for this page */
  helpContent = {
    title: 'Inventory List Help',
    sections: [
      {
        heading: 'Searching',
        text: 'Type an item name in the search bar to filter the inventory list. The search matches partial names and is case-insensitive.'
      },
      {
        heading: 'Stock Status Colors',
        text: '🟢 In Stock = quantity > 10 | 🟡 Low Stock = 1-10 | 🔴 Out of Stock = 0'
      },
      {
        heading: 'Featured Items',
        text: 'Items with a ⭐ badge have a featured rating greater than 0, indicating popular or highlighted products.'
      },
      {
        heading: 'Pull to Refresh',
        text: 'Pull down on the list to refresh data from the server. This ensures you see the latest inventory changes.'
      }
    ]
  };

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.loadInventory();
    this.setupSearchListener();
  }

  /**
   * Load inventory items from the API
   */
  loadInventory(): void {
    this.apiService.fetchAllItems().subscribe({
      next: (items) => {
        this.filteredItems.set(items);
      },
      error: () => {
        // Error handled by ApiService
      }
    });
  }

  /**
   * Set up reactive search listener
   * Filters inventory on search input change
   */
  private setupSearchListener(): void {
    this.searchControl.valueChanges.subscribe(term => {
      const searchTerm = (term || '').trim();
      if (searchTerm.length === 0) {
        this.isSearching.set(false);
        this.filteredItems.set(this.apiService.inventory());
      } else {
        this.isSearching.set(true);
        this.filteredItems.set(this.apiService.searchByName(searchTerm));
      }
    });
  }

  /**
   * Handle pull-to-refresh
   */
  onRefresh(event: any): void {
    this.apiService.fetchAllItems().subscribe({
      next: (items) => {
        this.filteredItems.set(items);
        this.searchControl.setValue('');
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  /**
   * Clear search and show all items
   */
  clearSearch(): void {
    this.searchControl.setValue('');
    this.isSearching.set(false);
    this.filteredItems.set(this.apiService.inventory());
  }

  /**
   * Get CSS class for stock status badge
   */
  getStockStatusClass(status: string): string {
    switch (status) {
      case StockStatus.InStock: return 'badge-success';
      case StockStatus.LowStock: return 'badge-warning';
      case StockStatus.OutOfStock: return 'badge-danger';
      default: return 'badge-default';
    }
  }

  /**
   * Get stock status icon name
   */
  getStockStatusIcon(status: string): string {
    switch (status) {
      case StockStatus.InStock: return 'checkmark-circle';
      case StockStatus.LowStock: return 'alert-circle';
      case StockStatus.OutOfStock: return 'close-circle';
      default: return 'help-circle';
    }
  }

  /**
   * TrackBy function for ngFor performance optimization
   */
  trackByItemId(index: number, item: InventoryItem): number {
    return item.itemId;
  }
}
