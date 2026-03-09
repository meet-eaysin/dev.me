'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/query-keys';
import { homeApi } from '../api';

export function useDailyReview() {
  return useQuery({
    queryKey: QUERY_KEYS.REVIEW.daily(),
    queryFn: homeApi.getDailyReview,
  });
}

export function useReviewRecommendations() {
  return useQuery({
    queryKey: QUERY_KEYS.REVIEW.recommendations(),
    queryFn: homeApi.getRecommendations,
  });
}

export function useDismissReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: homeApi.dismissReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEW.ROOT });
    },
  });
}
