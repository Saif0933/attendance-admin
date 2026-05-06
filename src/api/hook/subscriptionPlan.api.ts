import { api } from "../../api/api";
import {
    CreateSubscriptionPlanInput,
    SubscriptionPlan,
    UpdateSubscriptionPlanInput
} from "../../types/admin.type";

// 🔹 Get All Active Subscription Plans
export const getAllSubscriptionPlansApi = async (): Promise<SubscriptionPlan[]> => {
  const { data } = await api.get("/subscription-plan");
  return data.data;
};

// 🔹 Get Subscription Plan By ID
export const getSubscriptionPlanByIdApi = async (id: string): Promise<SubscriptionPlan> => {
  const { data } = await api.get(`/subscription-plan/${id}`);
  return data.data;
};

// 🔹 Create New Subscription Plan
export const createSubscriptionPlanApi = async (
  planData: CreateSubscriptionPlanInput
): Promise<SubscriptionPlan> => {
  const { data } = await api.post("/subscription-plan", planData);
  return data.data;
};

// 🔹 Update Subscription Plan
export const updateSubscriptionPlanApi = async (
  id: string,
  planData: UpdateSubscriptionPlanInput
): Promise<SubscriptionPlan> => {
  const { data } = await api.put(`/subscription-plan/${id}`, planData);
  return data.data;
};

// 🔹 Delete (Deactivate) Subscription Plan
export const deleteSubscriptionPlanApi = async (id: string): Promise<null> => {
  const { data } = await api.delete(`/subscription-plan/${id}`);
  return data.data;
};
