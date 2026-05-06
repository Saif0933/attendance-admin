// src/api/admin.api.ts
import { api } from "../../api/api";
import {
  Admin,
  AdminCreateInput,
  AdminLoginInput,
  AdminLoginResponse,
  CompaniesResponse,
  CompanyQueryParams,
  DashboardStats
} from "../../types/admin.type";

// 🔹 Admin Login
export const loginAdminApi = async (
  loginData: AdminLoginInput
): Promise<AdminLoginResponse> => {
  const { data } = await api.post("/admin/login", loginData);
  return data;
};

// 🔹 Create Admin
export const createAdminApi = async (
  adminData: AdminCreateInput
): Promise<Admin> => {
  const { data } = await api.post("/admin/create", adminData);
  return data.data;
};

// 🔹 Get Companies with Pagination + Search
export const getCompaniesApi = async (
  params: CompanyQueryParams
): Promise<CompaniesResponse> => {
  const { data } = await api.get("/admin/companies", {
    params,
  });

  return data.data;
};

// 🔹 Get Dashboard Stats
export const getDashboardStatsApi = async (): Promise<DashboardStats> => {
  const { data } = await api.get("/admin/dashboard-stats");
  return data.data;
};

