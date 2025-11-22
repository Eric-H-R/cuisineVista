import API from '../../../services/api';

const unidadesService = {
  // Obtener todas las unidades
  getAll: () => {
    return API.get('/unidades');
  },

  // Obtener unidad por ID
  getById: (unidadId) => {
    return API.get(`/unidades/${unidadId}`);
  },

  // Crear nueva unidad
  create: (unidadData) => {
    return API.post('/unidades', unidadData);
  },

  // Actualizar unidad
  update: (unidadId, unidadData) => {
    return API.put(`/unidades/${unidadId}`, unidadData);
  },

  // Eliminar/desactivar unidad
  delete: (unidadId) => {
    return API.delete(`/unidades/${unidadId}`);
  }
};

export default unidadesService;