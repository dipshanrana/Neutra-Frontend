# Nutra Backend — API Endpoints Documentation

> **Base URL:** `http://localhost:8080/api`
>
> All endpoints below are relative to this base URL.
> For example, `POST /auth/login` means `POST http://localhost:8080/api/auth/login`

---

## 🔑 Default Admin Credentials

A static admin account is auto-seeded on first startup:

| Field    | Value            |
|----------|------------------|
| Username | `admin@admin.com`|
| Password | `admin123`       |

---

## 🔐 Authentication Headers

For endpoints marked **🔒 ADMIN**, you must include a JWT token in the request header:

```
Authorization: Bearer <your-jwt-token>
```

You can obtain a token by calling the **Login** or **Signup** endpoints.

---

---

## 1. Authentication Endpoints

### 1.1 Admin Login

| Property    | Value                |
|-------------|----------------------|
| **Method**  | `POST`               |
| **URL**     | `/auth/admin/login`  |
| **Auth**    | None                 |

> Only users with the **ADMIN** role can log in through this endpoint. Attempting to log in with a CUSTOMER account will return an error.

**Request Body:**
```json
{
  "username": "admin@admin.com",
  "password": "admin123"
}
```

**Success Response (200 OK):**
```json
{
  "userId": "1",
  "username": "admin@admin.com",
  "JwtToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Access denied. Not an admin account."
}
```

---

### 1.2 User Login

| Property    | Value                |
|-------------|----------------------|
| **Method**  | `POST`               |
| **URL**     | `/auth/user/login`   |
| **Auth**    | None                 |

> Only users with the **CUSTOMER** role can log in through this endpoint. Attempting to log in with an ADMIN account will return an error.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "userId": "2",
  "username": "johndoe",
  "JwtToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Access denied. Not a customer account."
}
```

---

### 1.3 Signup

| Property    | Value                |
|-------------|----------------------|
| **Method**  | `POST`               |
| **URL**     | `/auth/signup`       |
| **Auth**    | None                 |

> Signup always creates a **CUSTOMER** role user. Admins can only be created via the Admin endpoint.

**Request Body:**
```json
{
  "username": "janedoe",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "userId": "3",
  "username": "janedoe",
  "JwtToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

---

## 2. Admin Endpoints

> All admin endpoints require **🔒 ADMIN** role JWT token.

### 2.1 Create New Admin

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/admin/users/admin`   |
| **Auth**    | 🔒 ADMIN              |

**Request Body:**
```json
{
  "username": "newadmin@admin.com",
  "password": "securePassword123"
}
```

**Success Response (201 Created):**
```json
{
  "id": 3,
  "username": "newadmin@admin.com",
  "role": "ADMIN"
}
```

---

### 2.2 Get All Registered Users

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/admin/users`         |
| **Auth**    | 🔒 ADMIN              |

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "admin@admin.com",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "username": "johndoe",
    "role": "CUSTOMER"
  }
]
```

---

---

## 3. Category Endpoints

### 3.1 Create Category

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/categories`          |
| **Auth**    | 🔒 ADMIN              |

**Request Body:**
```json
{
  "name": "Supplements",
  "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2L2 7l10 5 10-5-10-5z'/></svg>"
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "name": "Supplements",
  "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2L2 7l10 5 10-5-10-5z'/></svg>"
}
```

---

### 3.2 Get All Categories

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/categories`          |
| **Auth**    | None (Public)          |

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Supplements",
    "svg": "<svg>...</svg>"
  },
  {
    "id": 2,
    "name": "Vitamins",
    "svg": "<svg>...</svg>"
  }
]
```

---

### 3.3 Get Category by ID

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/categories/{id}`     |
| **Auth**    | None (Public)          |

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Supplements",
  "svg": "<svg>...</svg>"
}
```

**Error Response (404):**
```json
{
  "error": "Category not found with id: 99"
}
```

---

### 3.4 Update Category

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `PUT`                  |
| **URL**     | `/categories/{id}`     |
| **Auth**    | 🔒 ADMIN              |

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "svg": "<svg>...updated...</svg>"
}
```

**Success Response (200 OK):** Updated `Category` object.

---

### 3.5 Delete Category

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `DELETE`               |
| **URL**     | `/categories/{id}`     |
| **Auth**    | 🔒 ADMIN              |

**Success Response (204 No Content):** Empty body.

---

---

## 4. Product Endpoints

### 4.1 Create Product

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/products`            |
| **Auth**    | 🔒 ADMIN              |
| **Content-Type** | `multipart/form-data` |

> If the category name doesn't exist, it is automatically created.

**Request Parts (Multipart):**

1.  **`product` (Content-Type: `application/json`)**:
    ```json
    {
      "name": "Whey Protein Isolate",
      "link": "https://example.com/products/whey-protein",
      "category": {
        "name": "Supplements",
        "svg": "<svg>...</svg>"
      },
      "description": "Premium whey protein isolate for lean muscle growth.",
      "singleProductMp": 3500.0,
      "singleProductSp": 2800.0,
      "twoProductMp": 7000.0,
      "twoProductSp": 5000.0,
      "threeProductMp": 10500.0,
      "threeProductSp": 7000.0,
      "benefits": [
        {
          "svg": "<svg>...</svg>",
          "nutrientName": "Protein",
          "benefitDescription": "Rapid absorption for quick recovery"
        },
        {
          "svg": "<svg>...</svg>",
          "nutrientName": "Purity",
          "benefitDescription": "High bioavailability and purity"
        }
      ],
      "servingSize": "1 Scoop (30g)",
      "capsulesPerContainer": "30 Scoops",
      "supplementFacts": [
        {
          "nutrientName": "Whey Protein Isolate",
          "amountPerServing": "25g",
          "amount": "83%"
        }
      ],
      "reviews": [
        {
          "username": "john_lifter",
          "stars": 5,
          "comment": "Great taste and mixes well!"
        }
      ],
      "freebies": [
        "Free Shaker",
        "Free Shipping over $50"
      ],
      "howToUse": [
        "Mix one scoop with 250ml of water",
        "Drink immediately after workout"
      ],
      "faqs": [
        {
          "question": "Is this product suitable for vegans?",
          "answer": "Yes, it is plant-based."
        }
      ]
    }
    ```
2.  **`featuredImages`**: `List<File>` (Exactly 2 files)
3.  **`singleProductImage`**: `File` (Optional)
4.  **`twoProductImage`**: `File` (Optional)
5.  **`threeProductImage`**: `File` (Optional)

**Frontend Implementation Example (JavaScript):**
```javascript
const formData = new FormData();

// 1. Add product data as a JSON blob
const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
formData.append('product', productBlob);

// 2. Add files
featuredImagesArray.forEach(file => formData.append('featuredImages', file));
formData.append('singleProductImage', fileInput1.files[0]);
formData.append('twoProductImage', fileInput2.files[0]);
formData.append('threeProductImage', fileInput3.files[0]);

// 3. Send request
fetch('/api/products', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token },
  body: formData // Content-Type is set automatically by the browser
});
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "name": "Whey Protein Isolate",
  "link": "https://example.com/products/whey-protein",
  "category": {
    "id": 1,
    "name": "Supplements",
    "svg": "<svg>...</svg>"
  },
  "featuredImages": [
    "data:image/png;base64,iVBORw0KGgoAAA...",
    "data:image/png;base64,iVBORw0KGgoAAA..."
  ],
  "singleProductImage": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "twoProductImage": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "threeProductImage": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "benefits": [
    {
      "svg": "<svg>...</svg>",
      "nutrientName": "Protein",
      "benefitDescription": "Rapid absorption for quick recovery"
    },
    {
      "svg": "<svg>...</svg>",
      "nutrientName": "Purity",
      "benefitDescription": "High bioavailability and purity"
    }
  ],
  "servingSize": "1 Scoop (30g)",
  "capsulesPerContainer": "30 Scoops",
  "supplementFacts": [
    {
      "nutrientName": "Whey Protein Isolate",
      "amountPerServing": "25g",
      "amount": "83%"
    }
  ],
  "reviews": [
    {
      "id": 1,
      "username": "john_lifter",
      "stars": 5,
      "comment": "Great taste and mixes well!"
    }
  ],
  "freebies": [
    "Free Shaker",
    "Free Shipping over $50"
  ],
  "howToUse": [
    "Mix one scoop with 250ml of water",
    "Drink immediately after workout"
  ],
  "faqs": [
    {
      "question": "Is this product suitable for vegans?",
      "answer": "Yes, it is plant-based."
    }
  ]
}
```

---

### 4.2 Get All Products

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/products`            |
| **Auth**    | None (Public)          |

**Success Response (200 OK):** `List<Product>`

---

### 4.3 Get Product by ID

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/products/{id}`       |
| **Auth**    | None (Public)          |

**Success Response (200 OK):** Full `Product` object (as shown in 4.1 response).

**Error Response (404):**
```json
{
  "error": "Product not found with id: 99"
}
```

---

### 4.4 Update Product

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `PUT`                  |
| **URL**     | `/products/{id}`       |
| **Auth**    | 🔒 ADMIN              |
| **Content-Type** | `multipart/form-data` |

**Request Parts:** Same structure as **Create Product (4.1)**. Include the `product` JSON and any new `MultipartFile` images to update. If an image part is not included, the existing image will be kept.

**Success Response (200 OK):** Updated `Product` object.

---

### 4.5 Delete Product

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `DELETE`               |
| **URL**     | `/products/{id}`       |
| **Auth**    | 🔒 ADMIN              |

**Success Response (204 No Content):** Empty body.

---

### 4.6 Get All Category Names

| Property    | Value                       |
|-------------|------------------------------|
| **Method**  | `GET`                        |
| **URL**     | `/products/categories`       |
| **Auth**    | None (Public)                |

> Returns only the names. For full category objects, use `GET /categories`.

**Success Response (200 OK):**
```json
["Supplements", "Vitamins", "Equipment"]
```

---

### 4.7 Get Sample Products from 3 Random Categories

| Property    | Value                                    |
|-------------|------------------------------------------|
| **Method**  | `GET`                                    |
| **URL**     | `/products/categories/sample-products`   |
| **Auth**    | None (Public)                            |

> Returns one product from each of up to 3 randomly selected categories. Useful for homepage previews.

**Success Response (200 OK):** `List<Product>` (max 3 items)

---

### 4.8 Get All Products (Random Order)

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/products/random`     |
| **Auth**    | None (Public)          |

**Success Response (200 OK):** `List<Product>` in shuffled order.

---

---

## 5. Product Search Endpoints

### 5.1 Search by Category Name

| Property        | Value                                          |
|-----------------|------------------------------------------------|
| **Method**      | `GET`                                          |
| **URL**         | `/products/search/category?category={name}`    |
| **Auth**        | None (Public)                                  |
| **Query Param** | `category` — category name (case-insensitive)  |

**Example:** `GET /products/search/category?category=Supplements`

**Success Response (200 OK):** `List<Product>`

---

### 5.2 Search by Product Name

| Property        | Value                                          |
|-----------------|------------------------------------------------|
| **Method**      | `GET`                                          |
| **URL**         | `/products/search/name?name={searchTerm}`      |
| **Auth**        | None (Public)                                  |
| **Query Param** | `name` — partial name match (case-insensitive) |

**Example:** `GET /products/search/name?name=whey`

**Success Response (200 OK):** `List<Product>`

---

### 5.3 Search by Price Range

| Property         | Value                                            |
|------------------|--------------------------------------------------|
| **Method**       | `GET`                                            |
| **URL**          | `/products/search/price?min={min}&max={max}`     |
| **Auth**         | None (Public)                                    |
| **Query Params** | `min` — minimum selling price (Double)           |
|                  | `max` — maximum selling price (Double)           |

**Example:** `GET /products/search/price?min=1000&max=3000`

**Success Response (200 OK):** `List<Product>`

---

---

## 6. Blog Endpoints

### 6.1 Create Blog

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/blogs`               |
| **Auth**    | 🔒 ADMIN              |

> A blog can be linked to one or more products via their IDs. This endpoint consumes `multipart/form-data`.

**Request Parts:**
1.  `blog`: A JSON blob containing the blog details (title, content, author, relatedProducts).
2.  `image`: (Optional) The blog's feature image file.

**JSON Part Example (`blog`):**
```json
{
  "title": "Top 5 Supplements for Beginners",
  "content": "Here are the top supplements every beginner should consider when starting their fitness journey...",
  "author": "Admin",
  "relatedProducts": [
    { "id": 1 },
    { "id": 3 }
  ]
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "title": "Top 5 Supplements for Beginners",
  "content": "Here are the top supplements every beginner should consider...",
  "author": "Admin",
  "relatedProducts": [
    {
      "id": 1,
      "name": "Whey Protein Isolate",
      "category": { "id": 1, "name": "Supplements", "svg": "..." },
      "description": "...",
      "mp": 3500.0,
      "sp": 2800.0,
      "discount": 20.0,
      "images": ["..."],
      "benefits": [
        {
          "svg": "<svg>...</svg>",
          "nutrientName": "Protein",
          "benefitDescription": "Rapid absorption for quick recovery"
        }
      ]
    }
  ]
}
```

---

### 6.2 Get All Blogs

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/blogs`               |
| **Auth**    | None (Public)          |

**Success Response (200 OK):** `List<Blog>`

---

### 6.3 Get Blog by ID

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/blogs/{id}`          |
| **Auth**    | None (Public)          |

**Success Response (200 OK):** Full `Blog` object with related products.

**Error Response (404):**
```json
{
  "error": "Blog not found with ID 99"
}
```

---

### 6.4 Update Blog

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `PUT`                  |
| **URL**     | `/blogs/{id}`          |
| **Auth**    | 🔒 ADMIN              |

**Request Parts:** Same as **Create Blog (6.1)**.

**Success Response (200 OK):** Updated `Blog` object.

---

### 6.5 Delete Blog

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `DELETE`               |
| **URL**     | `/blogs/{id}`          |
| **Auth**    | 🔒 ADMIN              |

**Success Response (204 No Content):** Empty body.

---

---

## 7. Information Endpoints

### 7.1 Create Information

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/information`         |
| **Auth**    | 🔒 ADMIN              |

> Can optionally be linked to a category. This endpoint consumes `multipart/form-data`.

**Request Parts:**
1.  `information`: A JSON blob containing the information details (title, content, category).
2.  `image`: (Optional) A single image file for this information section.

**JSON Part Example (`information`):**
```json
{
  "title": "About Our Supplements",
  "content": "We source our supplements from the finest manufacturers worldwide. Every product goes through rigorous testing...",
  "category": {
    "id": 1
  }
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "title": "About Our Supplements",
  "content": "We source our supplements from the finest manufacturers worldwide...",
  "category": {
    "id": 1,
    "name": "Supplements",
    "svg": "<svg>...</svg>"
  }
}
```

---

### 7.2 Get All Information

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/information`         |
| **Auth**    | None (Public)          |

**Success Response (200 OK):** `List<Information>`

---

### 7.3 Get Information by ID

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/information/{id}`    |
| **Auth**    | None (Public)          |

**Success Response (200 OK):** Full `Information` object.

**Error Response (404):**
```json
{
  "error": "Information not found with ID 99"
}
```

---

### 7.4 Update Information

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `PUT`                  |
| **URL**     | `/information/{id}`    |
| **Auth**    | 🔒 ADMIN              |

**Request Parts:** Same as **Create Information (7.1)**.

**Success Response (200 OK):** Updated `Information` object.

---

### 7.5 Delete Information

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `DELETE`               |
| **URL**     | `/information/{id}`    |
| **Auth**    | 🔒 ADMIN              |

**Success Response (204 No Content):** Empty body.

---

---

## 8. Analytics Endpoints

### 8.1 Record a Visit

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/analytics/record`    |
| **Auth**    | None (Public)          |

**Request Body:** None required

**Success Response (200 OK):**
```json
{
  "message": "Visit recorded"
}
```

---

### 8.2 Get Analytics Statistics

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/analytics/stats`     |
| **Auth**    | None (Public)          |

**Success Response (200 OK):**
```json
{
  "byCountry": [
    {
      "country": "Unknown",
      "clicks": 1
    }
  ],
  "totalVisits": 1
}
```

---

---

## 9. Error Responses

All errors follow a consistent JSON format:

```json
{
  "error": "Error message description"
}
```

| Exception Type               | HTTP Status         |
|------------------------------|---------------------|
| `ResourceNotFoundException`  | `404 Not Found`     |
| `RuntimeException`           | `400 Bad Request`   |
| `Exception` (generic)        | `500 Internal Error`|
| Unauthorized / No Token      | `401 Unauthorized`  |
| Forbidden / Wrong Role       | `403 Forbidden`     |

---

## 10. Quick Reference Table

| #  | Method   | Endpoint                                 | Auth         | Description                              |
|----|----------|------------------------------------------|--------------|------------------------------------------|
| 1  | `POST`   | `/auth/admin/login`                      | None         | Admin login — validates ADMIN role       |
| 2  | `POST`   | `/auth/user/login`                       | None         | User login — validates CUSTOMER role     |
| 3  | `POST`   | `/auth/signup`                           | None         | Register as Customer                     |
| 4  | `POST`   | `/admin/users/admin`                     | 🔒 ADMIN    | Create a new Admin user                  |
| 5  | `GET`    | `/admin/users`                           | 🔒 ADMIN    | List all users                           |
| 6  | `POST`   | `/categories`                            | 🔒 ADMIN    | Create a category                        |
| 7  | `GET`    | `/categories`                            | None         | Get all categories                       |
| 8  | `GET`    | `/categories/{id}`                       | None         | Get category by ID                       |
| 9  | `PUT`    | `/categories/{id}`                       | 🔒 ADMIN    | Update a category                        |
| 10 | `DELETE` | `/categories/{id}`                       | 🔒 ADMIN    | Delete a category                        |
| 11 | `POST`   | `/products`                              | 🔒 ADMIN    | Create a product                         |
| 12 | `GET`    | `/products`                              | None         | Get all products                         |
| 13 | `GET`    | `/products/{id}`                         | None         | Get product by ID                        |
| 14 | `PUT`    | `/products/{id}`                         | 🔒 ADMIN    | Update a product                         |
| 15 | `DELETE` | `/products/{id}`                         | 🔒 ADMIN    | Delete a product                         |
| 16 | `GET`    | `/products/categories`                   | None         | Get all category names                   |
| 17 | `GET`    | `/products/categories/sample-products`   | None         | Get 1 product from 3 random categories   |
| 18 | `GET`    | `/products/random`                       | None         | Get all products (random order)          |
| 19 | `GET`    | `/products/search/category?category=X`   | None         | Search products by category              |
| 20 | `GET`    | `/products/search/name?name=X`           | None         | Search products by name                  |
| 21 | `GET`    | `/products/search/price?min=X&max=Y`     | None         | Search products by price range           |
| 22 | `POST`   | `/blogs`                                 | 🔒 ADMIN    | Create a blog post                       |
| 23 | `GET`    | `/blogs`                                 | None         | Get all blog posts                       |
| 24 | `GET`    | `/blogs/{id}`                            | None         | Get blog by ID                           |
| 25 | `PUT`    | `/blogs/{id}`                            | 🔒 ADMIN    | Update a blog post                       |
| 26 | `DELETE` | `/blogs/{id}`                            | 🔒 ADMIN    | Delete a blog post                       |
| 27 | `POST`   | `/information`                           | 🔒 ADMIN    | Create an information page               |
| 28 | `GET`    | `/information`                           | None         | Get all information pages                |
| 29 | `GET`    | `/information/{id}`                      | None         | Get information by ID                    |
| 30 | `PUT`    | `/information/{id}`                      | 🔒 ADMIN    | Update an information page               |
| 31 | `DELETE` | `/information/{id}`                      | 🔒 ADMIN    | Delete an information page               |
| 32 | `POST`   | `/analytics/record`                      | None         | Record a new visit based on IP           |
| 33 | `GET`    | `/analytics/stats`                       | None         | Get analytics statistics                 |
---

---

## 11. Working with Images (Frontend Guide)

### 11.1 Uploading Images (Multipart/Form-Data)
When creating or updating a product, images must be sent as binary files using the `FormData` browser API. Do **not** send raw JSON for these endpoints.

**Steps:**
1.  Construct a `FormData` object.
2.  Attach the product JSON as a `Blob` with type `application/json`.
3.  Attach individual or lists of files.

```javascript
const formData = new FormData();

// Build the product data object (excluding images)
const productData = {
  name: "My Product",
  description: "Description here...",
  // ... rest of product fields
};

// Convert JSON data to a Blob so the backend identifies it as JSON
const jsonBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
formData.append('product', jsonBlob);

// Append files (from <input type="file"> or state)
formData.append('singleProductImage', selectedFile1);
formData.append('twoProductImage', selectedFile2);

// Append multiple files for featuredImages (exactly 2 required)
featuredFilesArray.forEach(file => {
  formData.append('featuredImages', file);
});

// Send via fetch/axios
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    // DO NOT set Content-Type header manually, 
    // the browser will set it to multipart/form-data with a boundary
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### 11.2 Displaying Images (Fetching)
The backend uses a custom serializer that automatically adds the `data:image/png;base64,` prefix to all byte-array fields. 

**This means you can use the response strings directly in your `src` attribute.**

```javascript
// Example: Displaying a product from a GET request
const product = {
  name: "Whey Protein",
  singleProductImage: "data:image/png;base64,iVBORw0KGgoAAA..." // Backend sends this
};

// In your React Component
return (
  <div>
    <h1>{product.name}</h1>
    
    {/* Use the string directly! No conversion needed. */}
    <img src={product.singleProductImage} alt="Main" />

    {/* Displaying featured images list */}
    {product.featuredImages.map((src, index) => (
      <img key={index} src={src} alt={`Featured ${index}`} />
    ))}
  </div>
);
```

**Key Advantages:**
*   **Plug-and-play**: No need to `atob` or prepend prefixes in your frontend code.
*   **Security**: Stored as binary in the DB, served as safe Data URLs.
*   **Size**: We've increased server limits (10MB per file) so high-res images are supported.
