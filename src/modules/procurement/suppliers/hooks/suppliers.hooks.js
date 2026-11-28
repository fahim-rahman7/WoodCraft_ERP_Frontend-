import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../api/suppliers.api";

// -----get suppliers
export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers', orgId],
    queryFn: getSuppliers,
  });
}