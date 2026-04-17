/**
 * ======================================
 * PROG2005 Assignment 3
 * API Service - RESTful API Integration
 * Author: Hanyu Man (whw343)
 * ======================================
 *
 * Handles all HTTP communication with the backend API.
 * Endpoint: https://prog2005.it.scu.edu.au/ArtGalley
 * Supports: GET, POST, PUT, DELETE operations
 */

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {
  InventoryItem,
  ItemFormData,
  StockStatus,
  calculateStockStatus,
  ApiResponse
} from '../models/inventory.model';

/** Base API endpoint URL */
const API_BASE_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /** Reactive inventory state using Angular Signals */
  private inventorySignal = signal<InventoryItem[]>([]);
  /** Public readonly signal for components to consume */
  readonly inventory = this.inventorySignal.asReadonly();

  /** Loading state signal */
  private loadingSignal = signal<boolean>(false);
  readonly isLoading = this.loadingSignal.asReadonly();

  /** Error state signal */
  private errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  /** Feedback message signal for user notifications */
  private feedbackSignal = signal<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  readonly feedbackMessage = this.feedbackSignal.asReadonly();

  /** Computed: total number of items */
  readonly totalItems = computed(() => this.inventorySignal().length);

  /** Computed: featured items (featuredItem > 0) */
  readonly featuredItems = computed(() =>
    this.inventorySignal().filter(item => item.featuredItem > 0)
  );

  /** Computed: out of stock items count */
  readonly outOfStockCount = computed(() =>
    this.inventorySignal().filter(item => item.stockStatus === StockStatus.OutOfStock).length
  );

  constructor(private http: HttpClient) {}

  // ==========================================
  // GET - Retrieve all inventory items
  // ==========================================

  /**
   * Fetch all inventory items from the API
   * Updates the reactive inventory signal on success
   */
  fetchAllItems(): Observable<InventoryItem[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<InventoryItem[]>(API_BASE_URL).pipe(
      tap(items => {
        // Ensure stockStatus is computed from quantity for consistency
        const enriched = items.map(item => ({
          ...item,
          stockStatus: item.stockStatus || calculateStockStatus(item.quantity)
        }));
        this.inventorySignal.set(enriched);
        this.loadingSignal.set(false);
        this.setFeedback('Items loaded successfully', 'success');
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ==========================================
  // GET - Retrieve a single item by ID
  // ==========================================

  /**
   * Fetch a single inventory item by its ID
   * @param itemId - The auto-incremented ID of the item
   */
  fetchItemById(itemId: number): Observable<InventoryItem> {
    this.loadingSignal.set(true);
    return this.http.get<InventoryItem>(`${API_BASE_URL}/${itemId}`).pipe(
      tap(() => this.loadingSignal.set(false)),
      catchError(error => this.handleError(error))
    );
  }

  // ==========================================
  // POST - Create a new inventory item
  // ==========================================

  /**
   * Add a new inventory item via POST request
   * The API auto-generates the itemId
   * @param formData - Item data without itemId and stockStatus
   */
  addItem(formData: ItemFormData): Observable<InventoryItem> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Build the payload with computed stockStatus
    const payload = {
      ...formData,
      stockStatus: calculateStockStatus(formData.quantity)
    };

    return this.http.post<InventoryItem>(API_BASE_URL, payload).pipe(
      tap(newItem => {
        this.inventorySignal.update(items => [...items, newItem]);
        this.loadingSignal.set(false);
        this.setFeedback(`"${newItem.itemName}" added successfully`, 'success');
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ==========================================
  // PUT - Update an existing inventory item
  // ==========================================

  /**
   * Update an existing inventory item via PUT request
   * @param itemId - The ID of the item to update
   * @param formData - Updated item data
   */
  updateItem(itemId: number, formData: ItemFormData): Observable<InventoryItem> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const payload = {
      ...formData,
      stockStatus: calculateStockStatus(formData.quantity)
    };

    return this.http.put<InventoryItem>(`${API_BASE_URL}/${itemId}`, payload).pipe(
      tap(updatedItem => {
        this.inventorySignal.update(items =>
          items.map(item => item.itemId === itemId ? { ...item, ...updatedItem } : item)
        );
        this.loadingSignal.set(false);
        this.setFeedback(`"${updatedItem.itemName}" updated successfully`, 'success');
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ==========================================
  // DELETE - Remove an inventory item
  // ==========================================

  /**
   * Delete an inventory item via DELETE request
   * NOTE: Deleting "Laptop" category items is forbidden by the API
   * @param itemId - The ID of the item to delete
   */
  deleteItem(itemId: number): Observable<any> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete(`${API_BASE_URL}/${itemId}`).pipe(
      tap(() => {
        this.inventorySignal.update(items =>
          items.filter(item => item.itemId !== itemId)
        );
        this.loadingSignal.set(false);
        this.setFeedback('Item deleted successfully', 'success');
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ==========================================
  // Search & Filter (Client-side)
  // ==========================================

  /**
   * Search inventory items by name (client-side filtering)
   * Uses the locally cached inventory signal
   * @param searchTerm - Partial name match
   */
  searchByName(searchTerm: string): InventoryItem[] {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return this.inventorySignal();

    return this.inventorySignal().filter(item =>
      item.itemName.toLowerCase().includes(term)
    );
  }

  /**
   * Filter featured items (featuredItem > 0)
   */
  getFeaturedItems(): InventoryItem[] {
    return this.inventorySignal().filter(item => item.featuredItem > 0);
  }

  // ==========================================
  // Feedback & Error Handling
  // ==========================================

  /**
   * Set feedback message for user notification
   * Auto-clears after 3 seconds
   */
  private setFeedback(message: string, type: 'success' | 'error' | 'info'): void {
    this.feedbackSignal.set({ message, type });
    // Auto-clear after 3 seconds
    setTimeout(() => this.feedbackSignal.set(null), 3000);
  }

  /**
   * Centralized HTTP error handler
   * Handles API errors including the "Laptop deletion forbidden" case
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loadingSignal.set(false);

    let errorMessage = 'An unknown error occurred';

    if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your network connection.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Invalid request. Please check your input.';
    } else if (error.status === 403) {
      errorMessage = 'Operation forbidden. Cannot delete "Laptop" category items.';
    } else if (error.status === 404) {
      errorMessage = 'Item not found. It may have been deleted already.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    this.errorSignal.set(errorMessage);
    this.setFeedback(errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Clear current error state
   */
  clearError(): void {
    this.errorSignal.set(null);
  }
}
