// API endpoints as constants
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
  },
  BOARDS: {
    LIST: "/api/boards",
    CREATE: "/api/boards",
    CREATE_ID: (id: string) => `/api/boards/${id}`,
    GET: (id: string) => `/api/boards/${id}`,
    UPDATE: (id: string) => `/api/boards/${id}`,
    DELETE: (id: string) => `/api/boards/${id}`,
  },
  COLUMNS: {
    CREATE: (boardId: string) => `/api/boards/${boardId}/columns`,
    CREATE_ID: (boardId: string, id: string) =>
      `/api/boards/${boardId}/columns/${id}`,
    UPDATE: (boardId: string, id: string) =>
      `/api/boards/${boardId}/columns/${id}`,
    DELETE: (boardId: string, id: string) =>
      `/api/boards/${boardId}/columns/${id}`,
  },
  CARDS: {
    CREATE: `/api/cards`,
    CREATE_ID: (cardId: string) => `/api/cards/${cardId}`,
    GET: (id: string) => `/api/cards/${id}`,
    UPDATE: (id: string) => `/api/cards/${id}`,
    MOVE: (id: string) => `/api/cards/${id}/move`,
    DELETE: (id: string) => `/api/cards/${id}`,
  },
  SUBTASKS: {
    CREATE: (cardId: string) => `/api/cards/${cardId}/subtasks`,
    CREATE_ID: (cardId: string, id: string) =>
      `/api/cards/${cardId}/subtasks/${id}`,
    UPDATE: (cardId: string, id: string) =>
      `/api/cards/${cardId}/subtasks/${id}`,
    DELETE: (cardId: string, id: string) =>
      `/api/cards/${cardId}/subtasks/${id}`,
  },
} as const;
