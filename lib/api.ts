// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type if it's not FormData (browser handles boundary for FormData)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth) {
    // Always prioritize admin token for authenticated requests,
    // since all requiresAuth endpoints are admin-only operations
    const token = getAdminToken() || getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
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

      // For GET requests that fail with 404/403/500, return empty gracefully
      if (method === 'GET' && (response.status === 404 || response.status === 403 || response.status === 500)) {
        console.warn(`[API WARNING] Gracefully suppressed ${response.status} from ${method} ${endpoint}`);
        return [] as any;
      }

      console.error(`[API ERROR] ${method} ${endpoint} (${response.status}):`, errorMessage);
      throw new ApiError(response.status, errorMessage);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const method = (options.method || 'GET').toUpperCase();
    console.error(`[NETWORK ERROR] ${method} ${endpoint}:`, error);

    if (method === 'GET') {
      return [] as any;
    }
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

// Helper to format base64 image strings with correct prefix
export function formatBase64Image(base64?: string): string {
  if (!base64 || base64.trim() === "") return "";
  if (base64.startsWith("data:") || base64.startsWith("http")) return base64;
  // If no prefix, assume it's raw base64 from backend
  return `data:image/png;base64,${base64}`;
}

/**
 * Robustly selects the primary display image for a product.
 * Prioritizes: Featured[0] > SinglePack > Images[0] > Fallback
 */
export function getProductMainImage(product?: Product | null): string {
  if (!product) return "/multi-vit.png";

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

  return "/multi-vit.png";
}

/**
 * Returns a unique list of all displayable images for a product gallery.
 */
export function getProductAllImages(product?: Product | null): string[] {
  if (!product) return ["/multi-vit.png"];

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

  return all.length > 0 ? all : ["/multi-vit.png"];
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
};

// ==================== Category APIs ====================

export interface Category {
  id?: number;
  name: string;
  svg: string;
  image?: string; // Base64 string from backend
}

export const categoryApi = {
  getAll: () =>
    apiFetch<Category[]>('/categories'),

  getById: (id: number) =>
    apiFetch<Category>(`/categories/${id}`),

  create: (formData: FormData) =>
    apiFetch<Category>('/categories', {
      method: 'POST',
      body: formData,
    }, true),

  update: (id: number, formData: FormData) =>
    apiFetch<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: formData,
    }, true),

  delete: (id: number) =>
    apiFetch<void>(`/categories/${id}`, {
      method: 'DELETE',
    }, true),
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
}

export const productApi = {
  getAll: () =>
    apiFetch<Product[]>('/products'),

  getById: (id: number) =>
    apiFetch<Product>(`/products/${id}`),

  getCategoryNames: () =>
    apiFetch<string[]>('/products/categories'),

  getSampleProducts: () =>
    apiFetch<Product[]>('/products/categories/sample-products'),

  getRandom: () =>
    apiFetch<Product[]>('/products/random'),

  create: (formData: FormData) =>
    apiFetch<Product>('/products', {
      method: 'POST',
      body: formData,
    }, true),

  update: (id: number, formData: FormData) =>
    apiFetch<Product>(`/products/${id}`, {
      method: 'PUT',
      body: formData,
    }, true),

  delete: (id: number) =>
    apiFetch<void>(`/products/${id}`, {
      method: 'DELETE',
    }, true),

  // Search APIs
  searchByCategory: (category: string) =>
    apiFetch<Product[]>(`/products/search/category?category=${encodeURIComponent(category)}`),

  searchByName: (name: string) =>
    apiFetch<Product[]>(`/products/search/name?name=${encodeURIComponent(name)}`),

  searchByPriceRange: (min: number, max: number) =>
    apiFetch<Product[]>(`/products/search/price?min=${min}&max=${max}`),
};

// ==================== Blog APIs ====================

export interface Blog {
  id?: number;
  title: string;
  content: string;
  author: string;
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
};

// ==================== Information APIs ====================

export interface Information {
  id?: number;
  title: string;
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

// Export all APIs
export const api = {
  auth: authApi,
  admin: adminApi,
  categories: categoryApi,
  products: productApi,
  blogs: blogApi,
  info: infoApi,
  analytics: analyticsApi,
};

export default api;
