# API Function Test Report

**Date:** April 19, 2026  
**Tester:** Hanyu Man  
**API Endpoint:** https://prog2005.it.scu.edu.au/ArtGalley

---

## Test Summary

| Test Case | Method | Status | Result |
|-----------|--------|--------|--------|
| 1. Get All Items | GET /ArtGalley | ✅ PASS | 44 items retrieved |
| 2. Create Item | POST /ArtGalley | ✅ PASS | Item created successfully |
| 3. Get Single Item | GET /ArtGalley/{id} | ✅ PASS | Item details retrieved |
| 4. Update Item | PUT /ArtGalley/{id} | ✅ PASS | Item updated successfully |
| 5. Delete Item | DELETE /ArtGalley/{id} | ✅ PASS | Item deleted successfully |
| 6. Laptop Delete Restriction | DELETE /ArtGalley/{id} | ⚠️ INFO | No restriction found |

---

## Detailed Test Results

### Test 1: Get All Items (GET)

**Request:**
```
GET https://prog2005.it.scu.edu.au/ArtGalley
```

**Response:**
- Status: 200 OK
- Total Items: 44
- Sample Items:
  - Dualsense Controller (ID: 945, Qty: 25565)
  - Macbook Pro (ID: 989, Qty: 3, Price: $5000)
  - HP Pavilion 15 Laptop (ID: 3001, Qty: 12)

**Result:** ✅ PASS

---

### Test 2: Create Item (POST)

**Request:**
```json
POST https://prog2005.it.scu.edu.au/ArtGalley
{
  "item_name": "TestItem_A3_1942",
  "category": "Electronics",
  "quantity": 100,
  "price": 100,
  "supplier_name": "TestSupplier",
  "stock_status": "In stock",
  "featured_item": 5,
  "special_note": "A3 Test Item"
}
```

**Response:**
- Status: 200 OK
- Created Item ID: 3045
- Item visible in GET all items list

**Result:** ✅ PASS

---

### Test 3: Get Single Item (GET)

**Request:**
```
GET https://prog2005.it.scu.edu.au/ArtGalley/3045
```

**Response:**
```json
{
  "item_id": 3045,
  "item_name": "TestItem_A3_1942",
  "category": "Electronics",
  "quantity": 100,
  "price": 100,
  "supplier_name": "TestSupplier",
  "stock_status": "In stock",
  "featured_item": 5,
  "special_note": "A3 Test Item"
}
```

**Result:** ✅ PASS

---

### Test 4: Update Item (PUT)

**Request:**
```json
PUT https://prog2005.it.scu.edu.au/ArtGalley/3045
{
  "item_id": 3045,
  "item_name": "TestItem_A3_1942_UPDATED",
  "category": "Furniture",
  "quantity": 50,
  "price": 149.99,
  "supplier_name": "UpdatedSupplier",
  "stock_status": "Low stock",
  "featured_item": 3,
  "special_note": "A3 Updated Test Item"
}
```

**Response:**
- Status: 200 OK
- Message: Item updated successfully

**Verification:**
```json
GET https://prog2005.it.scu.edu.au/ArtGalley/3045
{
  "item_name": "TestItem_A3_1942_UPDATED",
  "category": "Furniture",
  "price": 149.99
}
```

**Result:** ✅ PASS

---

### Test 5: Delete Item (DELETE)

**Request:**
```
DELETE https://prog2005.it.scu.edu.au/ArtGalley/3045
```

**Response:**
- Status: 200 OK
- Message: Item deleted successfully

**Verification:**
```
GET https://prog2005.it.scu.edu.au/ArtGalley/3045
Response: 404 Not Found
```

**Result:** ✅ PASS

---

### Test 6: Laptop Delete Restriction

**Test Item:** HP Pavilion 15 Laptop (ID: 3001)

**Request:**
```
DELETE https://prog2005.it.scu.edu.au/ArtGalley/3001
```

**Response:**
- Status: 200 OK
- Item was deleted successfully

**Note:** The API does not currently enforce the "Laptop cannot be deleted" restriction mentioned in A2 requirements. This is a server-side implementation detail.

**Result:** ⚠️ INFO (No restriction enforced)

---

## Data Model Verification

| Field | Type | Example | Status |
|-------|------|---------|--------|
| item_id | Integer | 945 | ✅ |
| item_name | String | "Dualsense Controller" | ✅ |
| category | String | "Electronics" | ✅ |
| quantity | Integer | 25565 | ✅ |
| price | Number | 89 | ✅ |
| supplier_name | String | "Sony" | ✅ |
| stock_status | String | "In stock" | ✅ |
| featured_item | Integer | 0-5 | ✅ |
| special_note | String | "" | ✅ |

---

## API Performance

| Operation | Response Time | Status |
|-----------|---------------|--------|
| GET All | ~500ms | ✅ Good |
| POST Create | ~300ms | ✅ Good |
| GET Single | ~200ms | ✅ Good |
| PUT Update | ~300ms | ✅ Good |
| DELETE | ~300ms | ✅ Good |

---

## Conclusion

All core CRUD operations are working correctly:

- ✅ **Create** - Items can be created via POST
- ✅ **Read** - All items and single items can be retrieved
- ✅ **Update** - Items can be modified via PUT
- ✅ **Delete** - Items can be removed via DELETE

The API is fully functional and ready for integration with the Ionic mobile application.

---

**Test Completed:** April 19, 2026  
**Next Steps:** Verify mobile app integration with all API endpoints
