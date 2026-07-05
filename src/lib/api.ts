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

  // Health
  async health() {
    return this.request<any>("/api/health");
  }
}

export const api = new ApiClient(API_BASE);
