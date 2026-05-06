import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    CreateSubscriptionPlanInput,
    UpdateSubscriptionPlanInput
} from "../../types/admin.type";
import {
    createSubscriptionPlanApi,
    deleteSubscriptionPlanApi,
    getAllSubscriptionPlansApi,
    getSubscriptionPlanByIdApi,
    updateSubscriptionPlanApi
} from "./subscriptionPlan.api";

// 🔹 Hook to Get All Subscription Plans
export const useGetAllSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: getAllSubscriptionPlansApi,
  });
};

// 🔹 Hook to Get a Specific Subscription Plan
export const useGetSubscriptionPlanById = (id: string) => {
  return useQuery({
    queryKey: ["subscription-plan", id],
    queryFn: () => getSubscriptionPlanByIdApi(id),
    enabled: !!id,
  });
};

// 🔹 Hook to Create a New Subscription Plan
export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planData: CreateSubscriptionPlanInput) => createSubscriptionPlanApi(planData),
    onSuccess: () => {
      // Refresh the list after successful creation
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
  });
};

// 🔹 Hook to Update an Existing Subscription Plan
export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, planData }: { id: string; planData: UpdateSubscriptionPlanInput }) => 
      updateSubscriptionPlanApi(id, planData),
    onSuccess: (_, variables) => {
      // Refresh both the list and the specific plan data
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-plan", variables.id] });
    },
  });
};

// 🔹 Hook to Deactivate a Subscription Plan
export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubscriptionPlanApi(id),
    onSuccess: () => {
      // Refresh the list after deactivation
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
  });
};
