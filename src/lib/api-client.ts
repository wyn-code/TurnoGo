import { API_CONFIG } from "./api-config";

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: Record<string, unknown> | object | FormData | null;
  params?: Record<string, string | number | boolean>;
  skipAuthRedirect?: boolean;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    let url = `${this.baseURL}${endpoint}`;
    
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  }

  private buildUrlWithBase(
    baseUrl: string,
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    let url = `${baseUrl}${endpoint}`;

    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  private buildHeaders(headers?: Record<string, string>, body?: RequestOptions["body"]): Record<string, string> {
    const defaultHeaders: Record<string, string> = {};

    // Para FormData dejamos que el browser setee el boundary automáticamente.
    if (!(body instanceof FormData)) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    if (this.token) {
      defaultHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    return { ...defaultHeaders, ...headers };
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = "GET",
      headers: customHeaders,
      body,
      params,
      skipAuthRedirect = false,
    } = options;

    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders(customHeaders, body);

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      // Manejo de errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        const errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}`;
        
        // Si es 401, limpiar token
        if (response.status === 401 && !skipAuthRedirect) {
          this.clearToken();
          window.location.href = "/login";
        }

        throw new Error(errorMessage);
      }

      // Para responses sin body (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  async post<T>(endpoint: string, body?: Record<string, unknown> | object | null, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  async put<T>(endpoint: string, body?: Record<string, unknown> | object | null, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  async patch<T>(endpoint: string, body?: Record<string, unknown> | object | null, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, headers });
  }

  async delete<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", params });
  }

  async requestWithBase<T>(baseUrl: string, endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = "GET",
      headers: customHeaders,
      body,
      params,
      skipAuthRedirect = false,
    } = options;

    const url = this.buildUrlWithBase(baseUrl, endpoint, params);
    const headers = this.buildHeaders(customHeaders, body);

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        const errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}`;

        if (response.status === 401 && !skipAuthRedirect) {
          this.clearToken();
          window.location.href = "/login";
        }

        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${url}]:`, error);
      throw error;
    }
  }

  async getWithBase<T>(baseUrl: string, endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.requestWithBase<T>(baseUrl, endpoint, { method: "GET", params });
  }

  async postWithBase<T>(
    baseUrl: string,
    endpoint: string,
    body?: Record<string, unknown> | object | FormData | null,
    headers?: Record<string, string>,
    skipAuthRedirect = false,
  ): Promise<T> {
    return this.requestWithBase<T>(baseUrl, endpoint, { method: "POST", body, headers, skipAuthRedirect });
  }
}

const apiClient = new ApiClient();

export default apiClient;
