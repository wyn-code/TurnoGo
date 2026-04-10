import apiClient from "@/lib/api-client";
import { API_BASE_URL, API_CONFIG } from "@/lib/api-config";
import type { Service, Professional } from "@/types";

export interface CreateBusinessRequest {
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  address: string;
  city: string;
  province: string;
  locality?: string;
  phone?: string;
  whatsapp: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface BusinessResponse {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  province: string;
  locality?: string;
  phone?: string;
  whatsapp: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  icon: string;
}

export const businessService = {
  getAllBusinesses: async (params?: { category?: string; city?: string; page?: number; limit?: number }) => {
    return apiClient.get<BusinessResponse[]>(API_CONFIG.endpoints.businesses, params);
  },

  getBusinessBySlug: async (slug: string) => {
    return apiClient.get<BusinessResponse>(API_CONFIG.endpoints.businessDetail(slug));
  },

  getBusinessById: async (id: string) => {
    return apiClient.get<BusinessResponse>(`${API_CONFIG.endpoints.businesses}/${id}`);
  },

  createBusiness: async (data: CreateBusinessRequest) => {
    return apiClient.post<BusinessResponse>(API_CONFIG.endpoints.businessCreate, data);
  },

  updateBusiness: async (id: string, data: Partial<CreateBusinessRequest>) => {
    return apiClient.put<BusinessResponse>(API_CONFIG.endpoints.businessUpdate(id), data);
  },

  deleteBusiness: async (id: string) => {
    return apiClient.delete<{ message: string }>(API_CONFIG.endpoints.businessDelete(id));
  },

  getBusinessServices: async (businessId: string) => {
    return apiClient.get<Service[]>(API_CONFIG.endpoints.servicesByBusiness(businessId));
  },

  getBusinessProfessionals: async (businessId: string) => {
    return apiClient.get<Professional[]>(API_CONFIG.endpoints.professionalsByBusiness(businessId));
  },

  getBusinessSchedule: async (businessId: string) => {
    return apiClient.get<Record<string, Record<string, string>>>(API_CONFIG.endpoints.schedulesByBusiness(businessId));
  },

  getCategories: async () => {
    return apiClient.getWithBase<CategoryResponse[]>(API_BASE_URL, "/api/categorias");
  },
};

export default businessService;
