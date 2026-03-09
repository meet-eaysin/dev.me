import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../api';

export function useDocuments(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['documents', page, limit],
    queryFn: () => libraryApi.getDocuments(page, limit),
  });
}
