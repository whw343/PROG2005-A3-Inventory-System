/**
 * ======================================
 * PROG2005 Assignment 3
 * Update & Delete Page (Tab 3)
 * Author: daitongxiao
 * ======================================
 *
 * Features:
 * - Search and filter items before selecting
 * - Select item from list for editing
 * - Pre-populate form with current item data
 * - Update item via PUT API
 * - Delete item with confirmation dialog
 * - Forbidden delete for "Laptop" category
 * - Edit mode animation and state management
 * - Help Widget integration
 * - Category filter chips
 */

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

import { ApiService } from '../../services/api.service';
import { InventoryItem, Category, ItemFormData, StockStatus } from '../../models/inventory.model';
import { HelpWidgetComponent } from '../../components/help-widget/help-widget.component';

@Component({
  selector: 'app-update-delete',
  templateUrl: './update-delete.page.html',
  styleUrls: ['./update-delete.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HelpWidgetComponent
  ],
})
export class UpdateDeletePage implements OnInit {
  /** Update form */
  updateForm!: FormGroup;

  /** Currently selected item for editing */
  selectedItem = signal<InventoryItem | null>(null);

  /** Whether currently in edit mode */
  isEditMode = signal<boolean>(false);

  /** Search query for filtering items */
  searchQuery = signal<string>('');

  /** Selected category filter */
  categoryFilter = signal<string>('');

  /** Category options */
  categories = Object.values(Category);

  /** Stock status enum for template */
  StockStatus = StockStatus;

  /** Filtered items based on search and category */
  filteredItems = computed(() => {
    let items = this.apiService.inventory();
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.categoryFilter();

    if (query) {
      items = items.filter(item =>
        item.itemName.toLowerCase().includes(query) ||
        item.supplierName?.toLowerCase().includes(query) ||
        item.itemId?.toString().includes(query)
      );
    }

    if (category) {
      items = items.filter(item => item.category === category);
    }

    return items;
  });

  /** Help content */
  helpContent = {
    title: 'Update & Delete Help',
    sections: [
      {
        heading: '🔍 Finding Items',
        text: 'Use the search bar to find items by name, supplier, or ID. Use category filter chips to narrow down results by product type.'
      },
      {
        heading: '✏️ Editing Items',
        text: 'Tap an item from the list to enter edit mode. The form will auto-populate with current values. Modify fields and tap "Update Item" to save changes via PUT API.'
      },
      {
        heading: '🗑️ Deleting Items',
        text: 'Tap the trash icon next to an item and confirm the deletion. Note: "Laptop" items cannot be deleted — this is an API-level restriction to maintain baseline data.'
      },
      {
        heading: '⚠️ Form Validation',
        text: 'Required fields (marked with *) must be filled. Price must be at least $0.01. Quantity cannot be negative. Invalid fields show red highlights.'
      },
      {
        heading: '🔄 Canceling Edits',
        text: 'Tap the X button or "Cancel" to exit edit mode without saving. All unsaved changes will be discarded.'
      }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadItems();
  }

  /**
   * Initialize the update form with validation rules
   */
  private initForm(): void {
    this.updateForm = this.fb.group({
      itemName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      category: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0.01, [Validators.required, Validators.min(0.01)]],
      supplierName: ['', [Validators.required, Validators.minLength(2)]],
      featuredItem: [0, [Validators.required, Validators.min(0)]],
      specialNote: ['']
    });
  }

  /**
   * Load inventory items from API
   */
  loadItems(): void {
    this.apiService.fetchAllItems().subscribe();
  }

  /**
   * Handle search input change
   */
  onSearchInput(event: any): void {
    const query = event.target.value ?? '';
    this.searchQuery.set(query);
  }

  /**
   * Set category filter
   */
  setCategoryFilter(category: string): void {
    this.categoryFilter.update(current => current === category ? '' : category);
  }

  /**
   * Select an item for editing and populate the form
   */
  selectItem(item: InventoryItem): void {
    this.selectedItem.set(item);
    this.isEditMode.set(true);
    this.updateForm.patchValue({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      supplierName: item.supplierName,
      featuredItem: item.featuredItem,
      specialNote: item.specialNote || ''
    });
  }

  /**
   * Submit updated item data via PUT
   */
  onUpdate(): void {
    if (this.updateForm.invalid || !this.selectedItem()) return;

    const formData: ItemFormData = this.updateForm.value;
    const itemId = this.selectedItem()!.itemId;

    this.apiService.updateItem(itemId, formData).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: `"${formData.itemName}" updated successfully!`,
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
        this.cancelEdit();
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Failed to update item. Please try again.',
          duration: 3000,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  /**
   * Show delete confirmation dialog
   * Prevents deletion of "Laptop" category items (API restriction)
   */
  async confirmDelete(item: InventoryItem, event?: Event): Promise<void> {
    event?.stopPropagation();

    // Check if item is a "Laptop" — API forbids this deletion
    if (item.itemName.toLowerCase().includes('laptop') || item.category?.toString().toLowerCase() === 'laptop') {
      const alert = await this.alertCtrl.create({
        header: '🚫 Delete Forbidden',
        message: 'Cannot delete "Laptop" items. This restriction is enforced by the API to ensure at least one record remains in the database.',
        buttons: ['OK'],
        cssClass: 'alert-danger'
      });
      await alert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to permanently delete <strong>"${item.itemName}"</strong> (ID: ${item.itemId})?<br><br>This action <strong>cannot</strong> be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          cssClass: 'alert-button-danger',
          handler: () => {
            this.apiService.deleteItem(item.itemId).subscribe({
              next: async () => {
                const toast = await this.toastCtrl.create({
                  message: `"${item.itemName}" deleted successfully.`,
                  duration: 2000,
                  color: 'success',
                  position: 'bottom'
                });
                await toast.present();
                if (this.selectedItem()?.itemId === item.itemId) {
                  this.cancelEdit();
                }
              },
              error: async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Failed to delete item. It may be a restricted item.',
                  duration: 3000,
                  color: 'danger',
                  position: 'bottom'
                });
                await toast.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Cancel editing and reset form to list view
   */
  cancelEdit(): void {
    this.selectedItem.set(null);
    this.isEditMode.set(false);
    this.updateForm.reset();
  }

  /**
   * Refresh items list
   */
  doRefresh(event: any): void {
    this.apiService.fetchAllItems().subscribe({
      complete: () => {
        event.target.complete();
      }
    });
  }

  /**
   * Get validation error message for a form control
   */
  getErrorMessage(controlName: string): string {
    const control = this.updateForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${this.formatLabel(controlName)} is required`;
    if (control.errors['minlength']) return `Minimum length: ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength']) return `Maximum length: ${control.errors['maxlength'].requiredLength} characters`;
    if (control.errors['min']) return `Minimum value: ${control.errors['min'].min}`;

    return 'Invalid input';
  }

  /**
   * Format control name to readable label
   */
  private formatLabel(controlName: string): string {
    const labels: Record<string, string> = {
      itemName: 'Item Name',
      category: 'Category',
      quantity: 'Quantity',
      price: 'Price',
      supplierName: 'Supplier Name',
      featuredItem: 'Featured Rating',
      specialNote: 'Special Note'
    };
    return labels[controlName] || controlName;
  }

  /**
   * Check if a form field has error
   */
  hasError(controlName: string): boolean {
    const control = this.updateForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * TrackBy for ngFor optimization
   */
  trackByItemId(index: number, item: InventoryItem): number {
    return item.itemId;
  }
}
