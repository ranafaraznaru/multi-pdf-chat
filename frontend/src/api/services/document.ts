import { makePostRequest, makeGetRequest, makeDeleteRequest } from '../client';
import { urls } from '../urls';
import { Document } from '@/types';

export const documentService = {
  list: async (): Promise<Document[]> => {
    const response = await makeGetRequest(urls.documents.list, {}, true);
    return response.data.documents;
  },
  upload: async (formData: FormData) => {
    return makePostRequest(urls.documents.upload, formData, {}, true);
  },
  delete: async (id: string | number) => {
    return makeDeleteRequest(urls.documents.delete(id), {}, true);
  },
};
