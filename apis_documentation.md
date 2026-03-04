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
      "discount": 20.0,
      "benefits": [
        {
          "svg": "<svg>...</svg>",
          "nutrientName": "Protein",
          "benefitDescription": "Builds lean muscle"
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
      ]
    }
    ```
2.  **`featuredImages`**: `List<File>` (Exactly 2 files)
3.  **`singleProductImage`**: `File` (Optional)
4.  **`twoProductImage`**: `File` (Optional)
5.  **`threeProductImage`**: `File` (Optional)

**Success Response (201 Created):** Full `Product` object.

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

**Success Response (200 OK):** Full `Product` object.

---

### 4.4 Update Product

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `PUT`                  |
| **URL**     | `/products/{id}`       |
| **Auth**    | 🔒 ADMIN              |
| **Content-Type** | `multipart/form-data` |

---

### 4.5 Delete Product

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `DELETE`               |
| **URL**     | `/products/{id}`       |
| **Auth**    | 🔒 ADMIN              |

---

---

## 6. Blog Endpoints

### 6.1 Create Blog

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/blogs`               |
| **Auth**    | 🔒 ADMIN              |
| **Content-Type** | `multipart/form-data` |

**Request Parts:**
1.  `blog`: A JSON blob (title, content, author, relatedProducts).
2.  `image`: (Optional) The blog's feature image file.

---

### 6.4 Update Blog

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `PUT`                  |
| **URL**     | `/blogs/{id}`          |
| **Auth**    | 🔒 ADMIN              |
| **Content-Type** | `multipart/form-data` |

---

## 7. Information Endpoints

### 7.1 Create Information

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/information`         |
| **Auth**    | 🔒 ADMIN              |
| **Content-Type** | `multipart/form-data` |

**Request Parts:**
1.  `information`: A JSON blob (title, content, category).
2.  `image`: (Optional) A single image file.

---

### 7.4 Update Information

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `PUT`                  |
| **URL**     | `/information/{id}`    |
| **Auth**    | 🔒 ADMIN              |
| **Content-Type** | `multipart/form-data` |

---

## 8. Analytics Endpoints

### 8.1 Record a Visit

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **URL**     | `/analytics/record`    |
| **Auth**    | None (Public)          |

---

### 8.2 Get Analytics Stats

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `GET`                  |
| **URL**     | `/analytics/stats`     |
| **Auth**    | None (Public)          |

---

## 9. Working with Base64 Images

The backend automatically serializes images as Base64 strings with the `data:image/png;base64,` prefix. You can use these strings directly in your `src` attributes.
