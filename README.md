# PROG2005 A3 - Ionic Mobile Inventory Management System

**Course:** PROG2005 Programming Mobile Systems  
**Assessment:** A3 - Mobile Application Development (40%)  
**University:** Southern Cross University  
**Semester:** 1, 2026  

## Team Members

| Member | GitHub | Role |
|--------|--------|------|
| Hanyu Man | [@whw343](https://github.com/whw343) | Core Architecture, API Integration, Inventory/Search Page |
| Bingru Song | [@BingruSong](https://github.com/BingruSong) | UI Design, Add Item Page, Featured Items |
| daitongxiao | [@daitongxiao](https://github.com/daitongxiao) | Update/Delete Page, Help Widget, Privacy & Security |

## Tech Stack

- **Framework:** Ionic 8 + Angular 20 (Standalone Components)
- **Language:** TypeScript 5.9 (Strict Mode)
- **State Management:** Angular Signals
- **Forms:** ReactiveForms + Validators
- **API:** RESTful (GET/POST/PUT/DELETE)
- **Build:** Capacitor for cross-platform deployment

## Project Structure

```
src/app/
├── app.component.ts          # Root component (Standalone)
├── app.config.ts             # Application configuration
├── app.routes.ts             # Root routing
├── models/
│   └── inventory.model.ts    # Data models, interfaces, enums
├── services/
│   └── api.service.ts        # RESTful API service with Signals
├── components/
│   └── help-widget/          # Reusable Help Widget component
└── pages/
    ├── tabs/                 # Tab navigation container (4 tabs)
    ├── inventory/            # Tab 1: List + Search
    ├── add-item/             # Tab 2: Add + Featured Items
    ├── update-delete/        # Tab 3: Update + Delete
    └── privacy-security/     # Tab 4: Privacy & Security Analysis
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Ionic CLI 7+

### Installation

```bash
git clone https://github.com/whw343/PROG2005-A3-Inventory-System.git
cd PROG2005-A3-Inventory-System
npm install
```

### Development Server

```bash
ionic serve
```

Navigate to `http://localhost:4200` in your browser.

### Build for Production

```bash
ionic build
```

### Build for Mobile

```bash
ionic cap add android    # Add Android platform
ionic cap add ios        # Add iOS platform
ionic cap build android  # Build for Android
ionic cap build ios      # Build for iOS
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `https://prog2005.it.scu.edu.au/ArtGalley` | Fetch all items |
| GET | `https://prog2005.it.scu.edu.au/ArtGalley/{id}` | Fetch item by ID |
| POST | `https://prog2005.it.scu.edu.au/ArtGalley` | Create new item |
| PUT | `https://prog2005.it.scu.edu.au/ArtGalley/{id}` | Update item |
| DELETE | `https://prog2005.it.scu.edu.au/ArtGalley/{id}` | Delete item |

> ⚠️ Note: Deleting "Laptop" category items is forbidden by the API.

## Data Model

| Field | Type | Description |
|-------|------|-------------|
| itemId | number | Auto-incremented ID (server-generated) |
| itemName | string | Product name |
| category | string | Electronics, Furniture, Clothing, Tools, Miscellaneous |
| quantity | number | Stock quantity |
| price | number | Unit price (AUD) |
| supplierName | string | Supplier information |
| stockStatus | string | In Stock / Low Stock / Out of Stock (auto-computed) |
| featuredItem | number | Featured rating (0 = not featured, default 0) |
| specialNote | string | Optional notes |

## HD Criteria Coverage

- ✅ Ionic Tabs template architecture
- ✅ Angular Standalone Components + Signals
- ✅ ReactiveForms with comprehensive validation
- ✅ RESTful API integration (full CRUD)
- ✅ Help Widget on every page
- ✅ Privacy & Security analysis page
- ✅ Responsive design with color-coded status
- ✅ Pull-to-refresh and loading states
- ✅ TypeScript strict mode with full type annotations
- ✅ Clear code documentation and comments
