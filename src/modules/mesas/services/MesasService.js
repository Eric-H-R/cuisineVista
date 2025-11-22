import API from "../../../services/api";

export const MesasService = {
  // Obtener mesas filtrando por area y sucursal. params puede incluir { solo_activas: true }
  getByArea: (areaId, sucursalId, params = {}) =>
    API.get("/mesas", { params: { area_id: areaId, sucursal_id: sucursalId, ...params } }),

  // Obtener mesas por sucursal con params opcionales
  getBySucursal: (sucursalId, params = {}) =>
    API.get("/mesas", { params: { sucursal_id: sucursalId, ...params } }),

  getById: (id) => API.get(`/mesas/${id}`),
  create: (data) => API.post("/mesas", data),
  update: (id, data) => API.put(`/mesas/${id}`, data),
  delete: (id) => API.delete(`/mesas/${id}`),
  getAll: (params = {}) => API.get("/mesas", { params })
};

export default MesasService;