import API from '../../../services/api';

const productosService = {
  // Obtener todos los productos
  getAll: () => {
    return API.get('/productos');
  },

  // Obtener producto por ID
  getById: (productoId) => {
    return API.get(`/productos/${productoId}`);
  },

  // Crear nuevo producto
  create: (productoData) => {
    return API.post('/productos', productoData);
  },

  // Actualizar producto
  update: (productoId, productoData) => {
    return API.put(`/productos/${productoId}`, productoData);
  },

  // Eliminar producto
  delete: (productoId) => {
    return API.delete(`/productos/${productoId}`);
  },
  
  getExistencias: (sucursalId, soloActivos = true) => {
    return API.post('/insumos/existencias', {
      sucursal_id: sucursalId,
      solo_activos: soloActivos
    });
  }
};

export default productosService;