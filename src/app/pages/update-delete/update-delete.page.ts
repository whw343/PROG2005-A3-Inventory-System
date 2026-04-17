/**
 * ======================================
 * PROG2005 Assignment 3
 * Update & Delete Page (Tab 3)
 * Author: daitongxiao
 * ======================================
 *
 * Features:
 * - Select item from list for editing
 * - Pre-populate form with current item data
 * - Update item via PUT API
 * - Delete item with confirmation dialog
 * - Forbidden delete for "Laptop" category
 * - Help Widget integration
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

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

  /** Category options */
  categories = Object.values(Category);

  /** Stock status enum for template */
  StockStatus = StockStatus;

  /** Help content */
  helpContent = {
    title: 'Update & Delete Help',
    sections: [
      {
        heading: 'Editing Items',
        text: 'Select an item from the list to edit. The form will be pre-populated with current values. Modify and tap "Update Item" to save changes.'
      },
      {
        heading: 'Deleting Items',
        text: 'Tap the delete icon next to an item and confirm the deletion. Note: "Laptop" items cannot be deleted as per API restrictions.'
      },
      {
        heading: 'Form Validation',
        text: 'All required fields must be filled before updating. Invalid fields will be highlighted with error messages.'
      }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    public apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadItems();
  }

  /**
   * Initialize the update form with validation
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
   * Select an item for editing and populate the form
   */
  selectItem(item: InventoryItem): void {
    this.selectedItem.set(item);
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
      next: () => {
        this.selectedItem.set(null);
        this.updateForm.reset();
      },
      error: () => {}
    });
  }

  /**
   * Show delete confirmation dialog
   * Prevents deletion of "Laptop" category items
   */
  async confirmDelete(item: InventoryItem): Promise<void> {
    // Check if item is a "Laptop" - API forbids this
    if (item.itemName.toLowerCase().includes('laptop') || item.category?.toString().toLowerCase() === 'laptop') {
      const alert = await this.alertCtrl.create({
        header: 'Delete Forbidden',
        message: 'Cannot delete "Laptop" items. This restriction is enforced by the API to ensure at least one record exists.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete "${item.itemName}" (ID: ${item.itemId})? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.apiService.deleteItem(item.itemId).subscribe({
              next: () => {
                if (this.selectedItem()?.itemId === item.itemId) {
                  this.selectedItem.set(null);
                  this.updateForm.reset();
                }
              },
              error: () => {}
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Cancel editing and reset form
   */
  cancelEdit(): void {
    this.selectedItem.set(null);
    this.updateForm.reset();
  }

  /**
   * Get validation error message
   */
  getErrorMessage(controlName: string): string {
    const control = this.updateForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${controlName} is required`;
    if (control.errors['minlength']) return `Minimum length: ${control.errors['minlength'].requiredLength}`;
    if (control.errors['min']) return `Minimum value: ${control.errors['min'].min}`;

    return 'Invalid input';
  }

  /**
   * TrackBy for ngFor
   */
  trackByItemId(index: number, item: InventoryItem): number {
    return item.itemId;
  }
}
