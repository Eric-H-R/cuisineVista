import API from "./api";

export function createApiService(endpoint) {
  return {
    getAll: () => API.get(`/${endpoint}`),
    getById: (id) => API.get(`/${endpoint}/${id}`),
    create: (data) => API.post(`/${endpoint}`, data),
    update: (id, data) => API.put(`/${endpoint}/${id}`, data),
    delete: (id) => API.delete(`/${endpoint}/${id}`),
  };
}
