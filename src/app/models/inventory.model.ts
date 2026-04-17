/**
 * ======================================
 * PROG2005 Assignment 3
 * Inventory Data Model - TypeScript Interfaces & Enums
 * Author: Hanyu Man (whw343)
 * ======================================
 */

/**
 * Item category enumeration
 * Matches the API category options
 */
export enum Category {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Clothing = 'Clothing',
  Tools = 'Tools',
  Miscellaneous = 'Miscellaneous'
}

/**
 * Stock status enumeration
 * Derived from quantity thresholds
 */
export enum StockStatus {
  InStock = 'In Stock',
  LowStock = 'Low Stock',
  OutOfStock = 'Out of Stock'
}

/**
 * Core inventory item interface
 * Matches the A3 API data structure with auto-increment ID
 * and Featured Item (Integer) replacing Popular Item
 */
export interface InventoryItem {
  /** Auto-incremented unique identifier from the API */
  itemId: number;
  /** Product name */
  itemName: string;
  /** Product category */
  category: Category | string;
  /** Stock quantity */
  quantity: number;
  /** Unit price in AUD */
  price: number;
  /** Supplier information */
  supplierName: string;
  /** Computed stock status based on quantity */
  stockStatus: StockStatus | string;
  /** Featured item rating (Integer, default 0) — replaces A2's Popular Item */
  featuredItem: number;
  /** Optional notes — replaces A2's Comment */
  specialNote?: string;
}

/**
 * Form data interface for creating/updating items
 * Excludes auto-generated fields (itemId, stockStatus)
 */
export interface ItemFormData {
  itemName: string;
  category: Category | string;
  quantity: number;
  price: number;
  supplierName: string;
  featuredItem: number;
  specialNote?: string;
}

/**
 * API response wrapper for single item operations
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Search and filter parameters for inventory queries
 */
export interface SearchFilter {
  /** Search by item name (partial match) */
  itemName?: string;
  /** Filter by category */
  category?: Category | string;
  /** Filter by stock status */
  stockStatus?: StockStatus | string;
  /** Filter by featured status (featuredItem > 0) */
  featuredOnly?: boolean;
}

/**
 * Helper: Calculate stock status from quantity
 * In Stock: quantity > 10
 * Low Stock: 1 <= quantity <= 10
 * Out of Stock: quantity === 0
 */
export function calculateStockStatus(quantity: number): StockStatus {
  if (quantity === 0) return StockStatus.OutOfStock;
  if (quantity <= 10) return StockStatus.LowStock;
  return StockStatus.InStock;
}

/**
 * Helper: Get all category options for form dropdowns
 */
export function getCategoryOptions(): string[] {
  return Object.values(Category);
}

/**
 * Helper: Get all stock status options for display
 */
export function getStockStatusOptions(): string[] {
  return Object.values(StockStatus);
}
