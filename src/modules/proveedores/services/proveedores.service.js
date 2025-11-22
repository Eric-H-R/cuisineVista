import API from '../../../services/api';

const proveedoresService = {
  // Obtener todos los proveedores
  getAll: () => {
    return API.get('/proveedores');
  },

  // Obtener proveedor por ID
  getById: (proveedorId) => {
    return API.get(`/proveedores/${proveedorId}`);
  },

  // Crear nuevo proveedor
  create: (proveedorData) => {
    return API.post('/proveedores', proveedorData);
  },

  // Actualizar proveedor
  update: (proveedorId, proveedorData) => {
    return API.put(`/proveedores/${proveedorId}`, proveedorData);
  },

  // Eliminar proveedor
  delete: (proveedorId) => {
    return API.delete(`/proveedores/${proveedorId}`);
  }
};

export default proveedoresService;