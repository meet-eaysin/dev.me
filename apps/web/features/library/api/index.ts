import { apiGet } from '@/lib/api';
import type { DocumentsListData } from '../types';

export const libraryApi = {
  getDocuments: (page = 1, limit = 20) => {
    return apiGet<DocumentsListData>(`/documents?page=${page}&limit=${limit}`);
  },
};
