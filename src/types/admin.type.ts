// src/types/admin.ts

export interface Company {
  id: string;
  name: string;
  address: string | null;
  code: string;
  logo: any | null;
  email: string | null;
  createdAt: string;
  _count: {
    employees: number;
    tasks: number;
  };
}



export interface CompanyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CompaniesResponse {
  companies: Company[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalRevenue: number;
  activeCompanies: number;
  totalEmployees: number;
  activeTasks: number;
  productivity: number;
  attendanceToday: number;
  recentActivities: {
    id: string;
    type: "COMPANY" | "TASK" | "ATTENDANCE";
    content: string;
    time: string;
  }[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  employeeLimit: number;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateSubscriptionPlanInput = Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">;
export type UpdateSubscriptionPlanInput = Partial<CreateSubscriptionPlanInput>;

export interface Admin {
  id: string;
  email: string;
  name?: string;
  role: "SUPER_ADMIN" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminCreateInput {
  email: string;
  password: string;
  name?: string;
  role?: "SUPER_ADMIN" | "ADMIN";
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: Admin;
}
