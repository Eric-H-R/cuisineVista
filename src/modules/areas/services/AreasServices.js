// Creación de servicios relacionados con las áreas del restaurante
import API from '../../../services/api'


export const AreasServices = {
  getBySucursal: (sucursalId) => API.get('/areas', { 
    params: { sucursal_id: sucursalId } 
  }),
  getById: (id) => API.get(`/areas/${id}`),
  create: (data) => API.post('/areas', data),
  update: (id, data) => API.put(`/areas/${id}`, data),
  delete: (id) => API.delete(`/areas/${id}`),
  getAll: (params = {}) => API.get('/areas', { params }),
};

export default AreasServices;


