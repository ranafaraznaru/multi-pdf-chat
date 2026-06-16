import { makePostRequest, makeGetRequest } from '../client';
import { urls } from '../urls';
import { ChatResponse, Message } from '@/types';

export const chatService = {
  query: async (docId: string | number, question: string): Promise<ChatResponse> => {
    const response = await makePostRequest(
      urls.chat.query(docId),
      { question, document_id: docId },
      {},
      true
    );
    return response.data;
  },
  getHistory: async (docId: string | number): Promise<Message[]> => {
    const response = await makeGetRequest(urls.chat.history(docId), {}, true);
    return response.data.history;
  },
};
