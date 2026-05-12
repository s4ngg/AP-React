import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { approveClaim, getSellerClaims } from "../api/sellerApi"

export const sellerClaimsQueryKey = ["claims", "seller"]

export const useSellerClaims = () =>
  useQuery({
    queryKey: sellerClaimsQueryKey,
    queryFn: getSellerClaims,
    staleTime: 0,
  })

export const useApproveClaimMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerClaimsQueryKey })
    },
  })
}
