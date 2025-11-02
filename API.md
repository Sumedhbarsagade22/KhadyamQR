# KhadyamQR API Documentation

## Base URL
- **Development:** `http://localhost:8080`
- **Production:** `https://your-domain.com`

---

## Authentication
All admin API routes require authentication via Supabase service role key (server-side only).

---

## Endpoints

### Demo/Health Check

#### `GET /api/ping`
Simple ping endpoint to check if server is running.

**Response:**
```json
{
  "message": "pong"
}
```

#### `GET /api/demo`
Demo endpoint that returns a message from environment variable.

**Response:**
```json
{
  "message": "Hello from Express server"
}
```

---

### Restaurants

#### `GET /api/restaurants`
Get all restaurants.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Restaurant Name",
    "slug": "restaurant-name",
    "logo_url": "https://...",
    "qr_url": "https://...",
    "active": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

#### `POST /api/restaurants`
Create a new restaurant.

**Request Body:**
```json
{
  "name": "Restaurant Name",
  "slug": "restaurant-name",
  "logo_base64": "data:image/png;base64,..." // Optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Restaurant Name",
  "slug": "restaurant-name",
  "logo_url": "https://...",
  "qr_url": null,
  "active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### `DELETE /api/restaurants/:id`
Delete a restaurant and all its menu items.

**Parameters:**
- `id` (path) - Restaurant UUID

**Response:**
```json
{
  "success": true
}
```

#### `PATCH /api/restaurants/:id/status`
Enable or disable a restaurant.

**Parameters:**
- `id` (path) - Restaurant UUID

**Request Body:**
```json
{
  "active": true // or false
}
```

**Response:**
```json
{
  "success": true
}
```

#### `POST /api/restaurants/qr`
Generate and upload QR code for a restaurant.

**Request Body:**
```json
{
  "slug": "restaurant-name",
  "restaurant_id": "uuid",
  "qr_base64": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "qr_url": "https://..."
}
```

#### `POST /api/restaurants/create-login`
Create login credentials for a restaurant owner.

**Request Body:**
```json
{
  "restaurant_id": "uuid",
  "email": "owner@restaurant.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "email": "owner@restaurant.com",
  "user_id": "uuid"
}
```

---

### Menu Items

#### `GET /api/restaurants/:restaurantId/menu-items`
Get all menu items for a restaurant.

**Parameters:**
- `restaurantId` (path) - Restaurant UUID

**Response:**
```json
[
  {
    "id": "uuid",
    "restaurant_id": "uuid",
    "name": "Menu Item Name",
    "description": "Item description",
    "price": 99.99,
    "image_url": "https://...",
    "available": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

#### `POST /api/restaurants/:restaurantId/menu-items`
Create a new menu item.

**Parameters:**
- `restaurantId` (path) - Restaurant UUID

**Request Body:**
```json
{
  "name": "Menu Item Name",
  "description": "Item description", // Optional
  "price": 99.99,
  "image_base64": "data:image/png;base64,...", // Optional
  "available": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "restaurant_id": "uuid",
  "name": "Menu Item Name",
  "description": "Item description",
  "price": 99.99,
  "image_url": "https://...",
  "available": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### `DELETE /api/menu-items/:itemId`
Delete a menu item.

**Parameters:**
- `itemId` (path) - Menu item UUID

**Response:**
```json
{
  "success": true
}
```

#### `PATCH /api/menu-items/:itemId/availability`
Toggle menu item availability.

**Parameters:**
- `itemId` (path) - Menu item UUID

**Request Body:**
```json
{
  "available": true // or false
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Error Responses

All endpoints return errors in the following format:

**4xx/5xx Response:**
```json
{
  "error": "Error message description"
}
```

### Common Error Codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side error)

---

## Image Upload Format

Images should be sent as base64-encoded data URLs:

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...
```

**Supported formats:**
- PNG
- JPEG
- WebP
- GIF

**Recommended:**
- Max file size: 5MB
- Max dimensions: 2000x2000px
- Compress images before upload

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production:
- Recommended: 100 requests per minute per IP
- QR generation: 10 requests per minute per IP

---

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All IDs are UUIDs (v4)
3. Slugs must be unique and URL-safe
4. Service role key should never be exposed to client
5. File uploads are handled via base64 encoding
6. QR codes are generated client-side and uploaded to server
7. Images are stored in Supabase Storage bucket 'khadyamqr'

---

## Example Usage

### JavaScript/TypeScript

```typescript
// Create a restaurant
const response = await fetch('/api/restaurants', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My Restaurant',
    slug: 'my-restaurant',
  }),
});

const restaurant = await response.json();

// Get menu items
const menuResponse = await fetch(`/api/restaurants/${restaurant.id}/menu-items`);
const menuItems = await menuResponse.json();
```

### cURL

```bash
# Get all restaurants
curl http://localhost:8080/api/restaurants

# Create a restaurant
curl -X POST http://localhost:8080/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{"name":"My Restaurant","slug":"my-restaurant"}'

# Delete a restaurant
curl -X DELETE http://localhost:8080/api/restaurants/{id}
```

---

**Last Updated:** 2025-10-09
**API Version:** 1.0
