const API_BASE = "https://finda.pp.ua";

interface ApiResponse<T> {
  data: T;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("finda_token", token);
      } else {
        localStorage.removeItem("finda_token");
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      return localStorage.getItem("finda_token");
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }));
      throw new Error(error.message?.[0] || error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  }

  // Auth
  async login(email: string, password: string) {
    const result = await this.request<{ token: string; user: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.token);
    return result;
  }

  async register(email: string, name: string, password: string) {
    const result = await this.request<{ token: string; user: any }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    });
    this.setToken(result.token);
    return result;
  }

  async getMe() {
    return this.request<any>("/api/auth/me");
  }

  logout() {
    this.setToken(null);
  }

  // Masters
  async getMasters(params?: {
    service?: string;
    city?: string;
    language?: string;
    country?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<any[]>(`/api/masters${query ? `?${query}` : ""}`);
  }

  async getMaster(id: string) {
    return this.request<any>(`/api/masters/${id}`);
  }

  // Categories & Services
  async getCategories() {
    return this.request<any[]>("/api/categories");
  }

  async getServices(categoryId?: string) {
    const query = categoryId ? `?categoryId=${categoryId}` : "";
    return this.request<any[]>(`/api/services${query}`);
  }

  // Languages, Countries, Cities
  async getLanguages() {
    return this.request<any[]>("/api/languages");
  }

  async getCountries() {
    return this.request<any[]>("/api/countries");
  }

  async getCities(countryId?: string) {
    const query = countryId ? `?countryId=${countryId}` : "";
    return this.request<any[]>(`/api/cities${query}`);
  }

  // Search
  async search(query: string) {
    return this.request<any[]>(`/api/search?q=${encodeURIComponent(query)}`);
  }

  // Favorites
  async getFavorites() {
    return this.request<any[]>("/api/favorites");
  }

  async addFavorite(masterId: string) {
    return this.request<any>("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ masterId }),
    });
  }

  async removeFavorite(masterId: string) {
    return this.request<any>(`/api/favorites/${masterId}`, {
      method: "DELETE",
    });
  }

  // Bookings
  async createBooking(data: { masterId: string; serviceId: string; date: string; startTime: string; notes?: string }) {
    return this.request<any>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getBookings() {
    return this.request<any[]>("/api/bookings");
  }

  async updateBookingStatus(id: string, status: string) {
    return this.request<any>(`/api/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async addReview(bookingId: string, rating: number, text?: string) {
    return this.request<any>(`/api/bookings/${bookingId}/review`, {
      method: "POST",
      body: JSON.stringify({ rating, text }),
    });
  }

  async getMasterSlots(masterId: string, date: string) {
    return this.request<any>(`/api/masters/${masterId}/slots?date=${date}`);
  }

  // Profile
  async updateProfile(data: { name?: string; phone?: string }) {
    return this.request<any>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin
  async getAdminAnalytics() {
    return this.request<any>('/api/admin/analytics');
  }

  async getAdminUsers(page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const query = params.toString();
    return this.request<any>(`/api/admin/users${query ? `?${query}` : ''}`);
  }

  async updateAdminUser(id: string, data: { role?: string; name?: string }) {
    return this.request<any>(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAdminVerifications(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<any>(`/api/admin/verifications${query}`);
  }

  async reviewVerification(id: string, status: string, notes?: string) {
    return this.request<any>(`/api/admin/verifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Health
  async health() {
    return this.request<any>("/api/health");
  }
}

export const api = new ApiClient(API_BASE);
