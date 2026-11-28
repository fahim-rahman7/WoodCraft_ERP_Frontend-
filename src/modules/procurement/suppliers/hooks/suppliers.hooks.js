import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../api/suppliers.api";

// -----get suppliers
export function useSuppliers(orgId, params) {
  return useQuery({
    queryKey: ["suppliers", orgId, params],
    queryFn: () => getSuppliers({ orgId, params }),
    select: (response) => response?.data || [],
    enabled: !!orgId,
  });
}