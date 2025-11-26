import API from '../../../services/api';

const insumosService = {
  // Obtener todos los insumos activos (sin existencias)
  getAll: () => {
    return API.get('/insumos');
  },

  // Obtener insumo por ID
  getById: (insumoId) => {
    return API.get(`/insumos/${insumoId}`);
  },

  // Crear nuevo insumo (solo ADMIN)
  create: (insumoData) => {
    return API.post('/insumos', insumoData);
  },

  // Actualizar insumo (solo ADMIN)
  update: (insumoId, insumoData) => {
    return API.put(`/insumos/${insumoId}`, insumoData);
  },

  // Obtener insumos con stock bajo
  getStockBajo: (sucursalId) => {
    return API.post('/insumos/stock-bajo/listar', {
      sucursal_id: sucursalId
    });
  },

  // Obtener insumos con existencias por sucursal
  getExistencias: (sucursalId) => {
    return API.post('/insumos/existencias', {
      sucursal_id: sucursalId
    });
  },
  // Obtener lotes próximos a vencer
  getLotesProximosVencer: (diasProximidad, sucursalId) => {
    return API.post('/insumos/lotes-proximos-vencer', {
      dias_proximidad: diasProximidad,
      sucursal_id: sucursalId
    });
  }
};

export default insumosService;