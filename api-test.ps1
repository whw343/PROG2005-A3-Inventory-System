# API Test Script for PROG2005 A3
# Tests all CRUD operations

$API_BASE = "https://prog2005.it.scu.edu.au/ArtGalley"
$TEST_ITEM_NAME = "TestItem_A3_$(Get-Random -Minimum 1000 -Maximum 9999)"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PROG2005 A3 API Function Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: GET All Items
Write-Host "[TEST 1] GET All Items" -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $response = Invoke-WebRequest -Uri $API_BASE -Method GET -UseBasicParsing
    $items = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "📊 Total Items: $($items.Count)" -ForegroundColor Green
    Write-Host "📋 First 3 items:" -ForegroundColor Gray
    $items | Select-Object -First 3 | ForEach-Object {
        Write-Host "   - $($_.item_name) (ID: $($_.item_id), Qty: $($_.quantity))" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: POST Create Item
Write-Host "[TEST 2] POST Create Item" -ForegroundColor Yellow
Write-Host "----------------------------------------"
$newItem = @{
    item_name = $TEST_ITEM_NAME
    category = "Electronics"
    quantity = 100
    price = 99.99
    supplier_name = "TestSupplier"
    stock_status = "In stock"
    featured_item = 5
    special_note = "A3 Test Item"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $API_BASE -Method POST -Body $newItem -ContentType "application/json" -UseBasicParsing
    $createdItem = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "📝 Created Item ID: $($createdItem.item_id)" -ForegroundColor Green
    Write-Host "📝 Name: $($createdItem.item_name)" -ForegroundColor Green
    $global:CREATED_ITEM_ID = $createdItem.item_id
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: GET Single Item
Write-Host "[TEST 3] GET Single Item (ID: $CREATED_ITEM_ID)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $response = Invoke-WebRequest -Uri "$API_BASE/$CREATED_ITEM_ID" -Method GET -UseBasicParsing
    $item = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "📋 Item: $($item.item_name)" -ForegroundColor Green
    Write-Host "📋 Category: $($item.category)" -ForegroundColor Green
    Write-Host "📋 Price: $($item.price)" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: PUT Update Item
Write-Host "[TEST 4] PUT Update Item (ID: $CREATED_ITEM_ID)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
$updatedItem = @{
    item_id = $CREATED_ITEM_ID
    item_name = "$TEST_ITEM_NAME-UPDATED"
    category = "Furniture"
    quantity = 50
    price = 149.99
    supplier_name = "UpdatedSupplier"
    stock_status = "Low stock"
    featured_item = 3
    special_note = "A3 Updated Test Item"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_BASE/$CREATED_ITEM_ID" -Method PUT -Body $updatedItem -ContentType "application/json" -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "📝 Message: $($result.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Verify Update
Write-Host "[TEST 5] Verify Update (GET after PUT)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $response = Invoke-WebRequest -Uri "$API_BASE/$CREATED_ITEM_ID" -Method GET -UseBasicParsing
    $item = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "📋 Updated Name: $($item.item_name)" -ForegroundColor Green
    Write-Host "📋 Updated Category: $($item.category)" -ForegroundColor Green
    Write-Host "📋 Updated Price: $($item.price)" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: DELETE Item
Write-Host "[TEST 6] DELETE Item (ID: $CREATED_ITEM_ID)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $response = Invoke-WebRequest -Uri "$API_BASE/$CREATED_ITEM_ID" -Method DELETE -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "📝 Message: $($result.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Verify Delete
Write-Host "[TEST 7] Verify Delete (GET after DELETE)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $response = Invoke-WebRequest -Uri "$API_BASE/$CREATED_ITEM_ID" -Method GET -UseBasicParsing
    Write-Host "⚠️ Item still exists (Status: $($response.StatusCode))" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "✅ Item successfully deleted (404 Not Found)" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 8: Test "Laptop" Delete Restriction
Write-Host "[TEST 8] Test 'Laptop' Delete Restriction" -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    # First find a laptop item
    $response = Invoke-WebRequest -Uri $API_BASE -Method GET -UseBasicParsing
    $items = $response.Content | ConvertFrom-Json
    $laptop = $items | Where-Object { $_.item_name -like "*Laptop*" } | Select-Object -First 1
    
    if ($laptop) {
        Write-Host "📋 Found Laptop: $($laptop.item_name) (ID: $($laptop.item_id))" -ForegroundColor Gray
        try {
            $deleteResponse = Invoke-WebRequest -Uri "$API_BASE/$($laptop.item_id)" -Method DELETE -UseBasicParsing
            Write-Host "⚠️ Delete succeeded (unexpected)" -ForegroundColor Yellow
        } catch {
            $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "✅ Delete correctly rejected" -ForegroundColor Green
            Write-Host "📝 Error: $($errorContent.error)" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️ No Laptop item found in database" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Test Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
