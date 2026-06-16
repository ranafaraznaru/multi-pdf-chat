export const urls = {
  auth: {
    login: '/v1/auth/login',
    register: '/v1/auth/register',
    me: '/v1/auth/me',
  },
  documents: {
    list: '/v1/documents',
    upload: '/v1/documents',
    delete: (id: string | number) => `/v1/documents/${id}`,
    details: (id: string | number) => `/v1/documents/${id}`,
  },
  chat: {
    query: (docId: string | number) => `/v1/chat/${docId}/query`,
    history: (docId: string | number) => `/v1/chat/${docId}/history`,
  },
};
