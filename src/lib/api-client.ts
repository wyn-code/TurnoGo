const API_BASE_URL = "/api";

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

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuthRedirect = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: Partial<ApiErrorResponse> = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));

      const errorMessage = errorData.detail ?? `HTTP ${response.status}`;

      if (response.status === 401 && !skipAuthRedirect) {
        this.clearToken();
        window.location.href = "/login";
      }

      throw new ApiError(errorMessage, response.status, errorData.detail);
    }

    return response.json() as Promise<T>;
  }

  private async requestWithBase<T>(
    baseUrl: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: Partial<ApiErrorResponse> = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));

      const errorMessage = errorData.detail ?? `HTTP ${response.status}`;

      throw new ApiError(errorMessage, response.status, errorData.detail);
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined)
        )
      : undefined;

    const query = filteredParams
      ? `?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(filteredParams).map(([key, value]) => [key, String(value)])
          )
        ).toString()}`
      : "";

    return this.request<T>(`${endpoint}${query}`);
  }

  post<T, B = unknown>(endpoint: string, data?: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T, B = unknown>(endpoint: string, data?: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  getWithBase<T>(
    baseUrl: string,
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined)
        )
      : undefined;

    const query = filteredParams
      ? `?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(filteredParams).map(([key, value]) => [key, String(value)])
          )
        ).toString()}`
      : "";

    return this.requestWithBase<T>(baseUrl, `${endpoint}${query}`);
  }
}

const apiClient = new ApiClient();

export default apiClient;