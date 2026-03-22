// API Configuration
// For Hydration consistency, we use the relative proxy path everywhere for string construction (like image URLs)
// The actual fetch logic will resolve the absolute URL on the server.
export const API_BASE_URL = "/api/backend";
export const IMAGE_BASE_URL = "http://209.126.86.149:8079";
const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://209.126.86.149:8079";
const IS_SERVER = typeof window === 'undefined';

// Simple in-memory cache to prevent redundant large fetches (e.g. Base64 images)
const apiCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 300000; // 5 minutes

function getCache<T>(key: string): T | null {
  if (IS_SERVER) return null; // Never serve stale cache on server — SSR must always see fresh data
  const cached = apiCache[key];
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: any) {
  if (IS_SERVER) return; // Don't populate cache on server — each SSR request fetches fresh
  apiCache[key] = { data, timestamp: Date.now() };
}

function clearCache(prefix?: string) {
  if (!prefix) {
    Object.keys(apiCache).forEach(k => delete apiCache[k]);
  } else {
    Object.keys(apiCache).forEach(k => {
      if (k.startsWith(prefix)) delete apiCache[k];
    });
  }
}

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwtToken');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  }
  return null;
};

export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  }
  return null;
};

// Helper function to get current user
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Helper function to logout
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
  }
};

// API Error Handler
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // On server, resolve the proxy path to the absolute server URL
  if (typeof window === 'undefined' && url.startsWith(API_BASE_URL)) {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://209.126.86.149:8079";
    url = url.replace(API_BASE_URL, serverUrl);
  }
  const token = requiresAuth ? (getAdminToken() || getAuthToken()) : null;
  console.log(`[NX API] ${options.method || 'GET'} ${url}`, {
    hasToken: !!token,
    hasBody: !!options.body
  });

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type if it's not FormData AND there is a body
  if (!(options.body instanceof FormData) && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      // Try to get detailed error from response
      try {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Fallback to raw text if not JSON
          if (text && text.length < 200) errorMessage = text;
        }
      } catch { }

      const method = (options.method || 'GET').toUpperCase();

      // Enhanced Error Messaging based on Status Codes
      if (response.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        if (typeof window !== 'undefined' && !endpoint.includes('/login')) {
          // Optional: auto-logout or redirect? for now just message
        }
      } else if (response.status === 403) {
        errorMessage = "Access Denied: You do not have permission to view this resource.";
      } else if (response.status === 404) {
        errorMessage = "Resource not found: The requested item could not be located.";
      } else if (response.status === 400 && endpoint.includes('/login')) {
        errorMessage = "Invalid credentials: Check your email and password.";
      } else if (response.status >= 500) {
        errorMessage = "System Error: Our servers are experiencing issues. Please try again later.";
      }

      // Log errors only if they are unexpected (500+) or not handled as simple validation (non-400)
      if (response.status >= 500 || (response.status !== 400 && response.status !== 401)) {
        console.error(`[API ERROR] ${method} ${endpoint} (${response.status}):`, errorMessage);
      } else {
        console.warn(`[API AUTH] ${method} ${endpoint} (${response.status}): Handled validation failure.`);
      }

      throw new ApiError(response.status, errorMessage);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    // Safely parse JSON or return undefined for empty bodies
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      // If it's not JSON but was successful, just return the text as casted type
      return text as unknown as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const method = (options.method || 'GET').toUpperCase();
    console.error(`[NETWORK ERROR] ${method} ${endpoint}:`, error);

    // Don't swallow errors for GET requests as it hides issues from users
    throw new Error(error instanceof Error ? error.message : 'Network error. Please check your connection.');
  }
}

// ==================== Authentication APIs ====================

export interface LoginRequest {
  username: string;
  password: string;
}

// Backend may return JwtToken (capital J) or jwtToken (lowercase j)
export interface AuthResponse {
  userId: number | null;
  username: string;
  jwtToken?: string;
  JwtToken?: string;
}

// Helper to extract JWT token regardless of casing
export function extractToken(data: AuthResponse): string | undefined {
  return data.jwtToken || data.JwtToken;
}

// Helper to format image URLs from backend (handles relative paths, base64, and full URLs)
export function formatImageUrl(src?: string): string {
  if (!src || src.trim() === "") return "";
  
  // 1. Return as-is if it's already a full URL or base64 with prefix
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  
  // 2. Handle relative paths from the backend (e.g., /uploads/image.jpg or uploads/image.jpg)
  if (src.startsWith("/uploads/") || src.startsWith("uploads/")) {
    const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const path = src.startsWith('/') ? src : `/${src}`;
    return `${baseUrl}${path}`;
  }
  
  // 3. Fallback for any other path that contains a slash (assumed relative)
  if (src.includes("/")) {
    const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const path = src.startsWith('/') ? src : `/${src}`;
    return `${baseUrl}${path}`;
  }

  return src;
}

// Alias for backward compatibility
export const formatBase64Image = formatImageUrl;

/**
 * Robustly selects the primary display image for a product.
 * Prioritizes: Featured[0] > SinglePack > Images[0] > Fallback
 */
export function getProductMainImage(product?: Product | null): string {
  if (!product) return "";

  // 1. Single Pack is the most accurate primary image
  if (product.singleProductImage && product.singleProductImage.trim() !== "") {
    return formatBase64Image(product.singleProductImage);
  }

  // 2. Fallback to featured images
  if (product.featuredImages && product.featuredImages.length > 0) {
    const firstFeatured = product.featuredImages.find(img => img && img.trim() !== "");
    if (firstFeatured) return formatBase64Image(firstFeatured);
  }

  // Fallback to legacy images array
  if (product.images && product.images.length > 0) {
    const firstImg = product.images.find(img => img && img.trim() !== "");
    if (firstImg) return formatBase64Image(firstImg);
  }

  return "";
}

/**
 * Returns a unique list of all displayable images for a product gallery.
 */
export function getProductAllImages(product?: Product | null): string[] {
  if (!product) return [];

  const all: string[] = [];

  // 1. Pack images appear at the front of the gallery (Single Pack first)
  [product.singleProductImage, product.twoProductImage, product.threeProductImage].forEach(img => {
    if (img && img.trim() !== "") {
      const formatted = formatBase64Image(img);
      if (!all.includes(formatted)) all.push(formatted);
    }
  });

  // 2. Featured images follow
  if (product.featuredImages) {
    product.featuredImages.forEach(img => {
      if (img && img.trim() !== "") {
        const formatted = formatBase64Image(img);
        if (!all.includes(formatted)) all.push(formatted);
      }
    });
  }

  // 3. Fallback to generic images
  if (product.images) {
    product.images.forEach(img => {
      if (img && img.trim() !== "") {
        const formatted = formatBase64Image(img);
        if (!all.includes(formatted)) all.push(formatted);
      }
    });
  }

  return all;
}

export const authApi = {
  // Admin-only login: POST /auth/admin/login
  adminLogin: (credentials: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Customer-only login: POST /auth/user/login
  userLogin: (credentials: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Customer signup: POST /auth/signup
  signup: (credentials: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

// ==================== Admin APIs ====================

export interface User {
  id: number;
  username: string;
  role: 'CUSTOMER' | 'ADMIN';
  active: boolean; // Added for deactivation status
}

export interface CreateAdminRequest {
  username: string;
  password: string;
}

export const adminApi = {
  createAdmin: (data: CreateAdminRequest) =>
    apiFetch<User>('/admin/users/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true),

  getAllUsers: () =>
    apiFetch<User[]>('/admin/users', {}, true),

  deactivateUser: (id: number) =>
    apiFetch<User>(`/admin/users/${id}/deactivate`, {
      method: 'PATCH',
    }, true),

  activateUser: (id: number) =>
    apiFetch<User>(`/admin/users/${id}/activate`, {
      method: 'PATCH',
    }, true),

  deleteUser: (id: number) =>
    apiFetch<void>(`/admin/users/${id}`, {
      method: 'DELETE',
    }, true),
};

// ==================== Category APIs ====================

export interface Category {
  id?: number;
  name: string;
  svg: string;
  badge?: string;
  shortDescription?: string;
  image?: string; // Path returned by backend
}

export const categoryApi = {
  getAll: async () => {
    const cached = getCache<Category[]>('/categories');
    if (cached) return cached;
    const data = await apiFetch<Category[]>('/categories');
    setCache('/categories', data);
    return data;
  },

  getById: (id: number) =>
    apiFetch<Category>(`/categories/${id}`),

  create: async (formData: FormData) => {
    const res = await apiFetch<Category>('/categories', {
      method: 'POST',
      body: formData,
    }, true);
    clearCache('/categories');
    return res;
  },

  update: async (id: number, formData: FormData) => {
    const res = await apiFetch<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: formData,
    }, true);
    clearCache('/categories');
    return res;
  },

  delete: async (id: number) => {
    const res = await apiFetch<void>(`/categories/${id}`, {
      method: 'DELETE',
    }, true);
    clearCache('/categories');
    return res;
  },
};

// ==================== Product APIs ====================

export interface Product {
  id?: number;
  name: string;
  link?: string;
  category: Category | string;
  description: string;
  singleProductMp?: number;
  singleProductSp?: number;
  twoProductMp?: number;
  twoProductSp?: number;
  threeProductMp?: number;
  threeProductSp?: number;
  mp: number; // For fallback
  sp: number; // For fallback
  discount: number;
  featuredImages?: string[];
  singleProductImage?: string;
  twoProductImage?: string;
  threeProductImage?: string;
  images: string[];
  benefitsParagraph?: string; // Match documentation
  benefits: {
    svg: string;
    nutrientName: string;
    benefitDescription: string;
  }[];
  servingSize?: string;
  capsulesPerContainer?: string;
  supplementFacts?: {
    nutrientName: string;
    amountPerServing: string;
    amount: string;
  }[];
  reviews?: {
    id?: number;
    username: string;
    stars: number;
    comment: string;
  }[];
  freebies?: string[];
  howToUse?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  badge?: string;
  categoryBadge?: string;
}

export const productApi = {
  getAll: async () => {
    const cached = getCache<Product[]>('/products');
    if (cached) return cached;
    const data = await apiFetch<Product[]>('/products');
    setCache('/products', data);
    return data;
  },

  getById: (id: number) =>
    apiFetch<Product>(`/products/${id}`),

  getCategoryNames: () =>
    apiFetch<string[]>('/products/categories'),

  getSampleProducts: () =>
    apiFetch<Product[]>('/products/categories/sample-products'),

  getRandom: () =>
    apiFetch<Product[]>('/products/random'),

  create: async (formData: FormData) => {
    const res = await apiFetch<Product>('/products', {
      method: 'POST',
      body: formData,
    }, true);
    clearCache('/products');
    return res;
  },

  update: async (id: number, formData: FormData) => {
    const res = await apiFetch<Product>(`/products/${id}`, {
      method: 'PUT',
      body: formData,
    }, true);
    clearCache('/products');
    return res;
  },

  delete: async (id: number) => {
    const res = await apiFetch<void>(`/products/${id}`, {
      method: 'DELETE',
    }, true);
    clearCache('/products');
    return res;
  },

  // Search APIs
  searchByCategory: (category: string) =>
    apiFetch<Product[]>(`/products/search/category?category=${encodeURIComponent(category)}`),

  searchByName: (name: string) =>
    apiFetch<Product[]>(`/products/search/name?name=${encodeURIComponent(name)}`),

  searchByPriceRange: (min: number, max: number) =>
    apiFetch<Product[]>(`/products/search/price?min=${min}&max=${max}`),

  searchByBadge: (badge: string) =>
    apiFetch<Product[]>(`/products/search/badge?badge=${encodeURIComponent(badge)}`),

  searchByCategoryBadge: (badge: string, category: string) =>
    apiFetch<Product[]>(`/products/search/category-badge?badge=${encodeURIComponent(badge)}&category=${encodeURIComponent(category)}`),

  bulkCreate: (products: any[]) =>
    apiFetch<Product[]>('/products/bulk', {
      method: 'POST',
      body: JSON.stringify(products),
    }, true),
};

// ==================== Blog APIs ====================

export interface Blog {
  id?: number;
  title: string;
  content: string;
  author: string;
  category?: Category | string;
  image?: string;
  relatedProducts?: Product[];
}

export const blogApi = {
  getAll: () =>
    apiFetch<Blog[]>('/blogs'),

  getById: (id: number) =>
    apiFetch<Blog>(`/blogs/${id}`),

  create: (data: Blog | FormData) =>
    apiFetch<Blog>('/blogs', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }, true),

  update: (id: number, data: Blog | FormData) =>
    apiFetch<Blog>(`/blogs/${id}`, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }, true),

  delete: (id: number) =>
    apiFetch<void>(`/blogs/${id}`, {
      method: 'DELETE',
    }, true),

  getByCategory: (categoryName: string) =>
    apiFetch<Blog[]>(`/blogs/category/${encodeURIComponent(categoryName)}`),
};

// ==================== Information APIs ====================

export interface Information {
  id?: number;
  title: string;
  description?: string;
  content: string;
  image?: string;
  category?: Category;
}

export const infoApi = {
  getAll: () =>
    apiFetch<Information[]>('/information'),

  getById: (id: number) =>
    apiFetch<Information>(`/information/${id}`),

  create: (data: Information | FormData) =>
    apiFetch<Information>('/information', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }, true),

  update: (id: number, data: Information | FormData) =>
    apiFetch<Information>(`/information/${id}`, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }, true),

  delete: (id: number) =>
    apiFetch<void>(`/information/${id}`, {
      method: 'DELETE',
    }, true),

  getByCategory: (categoryName: string) =>
    apiFetch<Information[]>(`/information/category/${encodeURIComponent(categoryName)}`),
};

// ==================== Analytics APIs ====================

export interface AnalyticsStats {
  byCountry: {
    country: string;
    clicks: number;
  }[];
  totalVisits: number;
}

export const analyticsApi = {
  recordVisit: () =>
    apiFetch<{ message: string }>('/analytics/record', {
      method: 'POST',
    }),

  getStats: () =>
    apiFetch<AnalyticsStats>('/analytics/stats'),
};

// ==================== Currency APIs ====================

export interface CurrencyRates {
  amount: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

export interface CurrencyConversion {
  base: string;
  targetCurrency: string;
  originalAmount: number;
  exchangeRate: number;
  convertedAmount: number;
  date: string;
}

export interface ProductPriceConversion {
  productId: number;
  productName: string;
  baseCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  date: string;
  singleProductMp: number;
  singleProductSp: number;
  twoProductMp: number;
  twoProductSp: number;
  threeProductMp: number;
  threeProductSp: number;
}

export const currencyApi = {
  getLatestRates: () =>
    apiFetch<CurrencyRates>('/currency/rates'),

  convertSingle: (amount: number, currency: string) =>
    apiFetch<CurrencyConversion>(`/currency/convert?amount=${amount}&currency=${currency}`),

  convertProduct: (productId: number, currency: string) =>
    apiFetch<ProductPriceConversion>(`/currency/product/${productId}?currency=${currency}`),
};

// Export all APIs
export const api = {
  auth: authApi,
  admin: adminApi,
  categories: categoryApi,
  products: productApi,
  blogs: blogApi,
  info: infoApi,
  analytics: analyticsApi,
  currency: currencyApi,
};

export default api;
