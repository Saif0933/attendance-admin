import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { AdminLoginInput, CompaniesResponse, CompanyQueryParams } from "../../types/admin.type";
import { getCompaniesApi, getDashboardStatsApi, loginAdminApi } from "./admin.api";

// 🔹 Admin Login Hook
export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (loginData: AdminLoginInput) => loginAdminApi(loginData),
  });
};

// 🔹 Companies Hook (Paginated)
export const useGetCompanies = (params: CompanyQueryParams) => {
  return useQuery({
    queryKey: ["admin-companies", params],
    queryFn: () => getCompaniesApi(params),
    placeholderData: keepPreviousData,
  });
};

// 🔹 Companies Hook (Infinite Scroll)
export const useGetInfiniteCompanies = (params: Omit<CompanyQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ["admin-companies-infinite", params],
    queryFn: ({ pageParam = 1 }) => getCompaniesApi({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: CompaniesResponse) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};


// 🔹 Dashboard Stats Hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStatsApi,
  });
};

