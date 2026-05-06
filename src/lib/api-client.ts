const API_BASE_URL = "http://localhost:8000/api";

export type ApiErrorResponse = {
  detail: string;
};

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail ?? message;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: Record<string, unknown> | object | FormData | null;
  params?: Record<string, string | number | boolean>;
  skipAuthRedirect?: boolean;
  omitAuth?: boolean;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // 🔹 Construye URL con query params
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    baseUrl: string = API_BASE_URL
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

  // 🔹 Headers
  private buildHeaders(
    customHeaders?: Record<string, string>,
    body?: RequestOptions["body"],
    omitAuth = false
  ): Record<string, string> {
    const headers: Record<string, string> = {};

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (this.token && !omitAuth) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return { ...headers, ...customHeaders };
  }

  // 🔹 Core request
  async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    baseUrl?: string
  ): Promise<T> {
    const {
      method = "GET",
      headers: customHeaders,
      body,
      params,
      skipAuthRedirect = false,
      omitAuth = false,
    } = options;

    const url = this.buildUrl(endpoint, params, baseUrl);

    const headers = this.buildHeaders(customHeaders, body, omitAuth);

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && ["POST", "PUT", "PATCH"].includes(method)) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: "Unknown error" }));

        const message =
          errorData.detail || errorData.message || `HTTP ${response.status}`;

        if (response.status === 401 && !skipAuthRedirect) {
          this.clearToken();
          window.location.href = "/login";
        }

        throw new ApiError(message, response.status, errorData.detail);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API ERROR [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // 🔹 Métodos públicos
  get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  post<T>(
    endpoint: string,
    body?: Record<string, unknown> | object | null,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  put<T>(
    endpoint: string,
    body?: Record<string, unknown> | object | null,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  patch<T>(
    endpoint: string,
    body?: Record<string, unknown> | object | null,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, headers });
  }

  delete<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", params });
  }

  // 🔹 Para usar otro base URL (ej: microservicios)
  getWithBase<T>(
    baseUrl: string,
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params }, baseUrl);
  }

  postWithBase<T>(
    baseUrl: string,
    endpoint: string,
    body?: object | FormData | null,
    headers?: Record<string, string>,
    skipAuthRedirect = false,
    omitAuth = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body,
        headers,
        skipAuthRedirect,
        omitAuth,
      },
      baseUrl
    );
  }
}

const apiClient = new ApiClient();
export default apiClient;