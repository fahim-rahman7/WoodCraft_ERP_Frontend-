import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupplier, getSuppliers } from "../api/suppliers.api";

// -----get suppliers
export function useSuppliers(orgId, params) {
  return useQuery({
    queryKey: ["suppliers", orgId, params],
    queryFn: () => getSuppliers({ orgId, params }),
    select: (response) => response?.data || [],
    enabled: !!orgId,
  });
}

// -----create supplier (refreshes the supplier list after saving)
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
