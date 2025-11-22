import API from '../../../services/api';

const comprasService = {
  // Obtener compras por sucursal
  getBySucursal: (sucursalId) => {
    return API.get(`/compras/${sucursalId}`);
  },

  // Obtener compra por ID
  getById: (compraId) => {
    return API.get(`/compras/id/${compraId}`);
  },

  // Crear nueva compra
  create: (compraData) => {
    return API.post('/compras', compraData);
  },

  // Cancelar compra
  cancelar: (compraId) => {
    return API.patch(`/compras/id/${compraId}/cancelar`);
  }
};

export default comprasService;