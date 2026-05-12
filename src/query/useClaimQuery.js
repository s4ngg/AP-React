import { useQuery } from "@tanstack/react-query"
import { getMyClaims } from "../api/claimApi"

export const useMyClaims = (enabled = true) =>
  useQuery({
    queryKey: ["claims", "my"],
    queryFn: getMyClaims,
    enabled,
    staleTime: 0,
  })
