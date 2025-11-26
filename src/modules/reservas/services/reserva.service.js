import API from '../../../services/api';

const reservaService = {
  // Crear un nuevo HOLD
  create: (holdData) => {
    return API.post('holds', holdData);
  },

  // Cancelar un HOLD
  cancel: (holdId, motivo) => {
    return API.post(`/holds/${holdId}/cancelar`, { motivo });
  },

   // Obtener todas las reservas con filtros
  getAllReservas: (filtros = {}) => {
    return API.post('/reservas/listar', filtros);
  },

  // Obtener reserva por ID
  getById: (reservaId) => {
    return API.get(`/reservas/${reservaId}`);
  },

  // Crear nueva reserva
  createReserva: (reservaData) => {
    return API.post('/reservas', reservaData);
  },

  // Cancelar reserva
  cancelReserva: (reservaId, motivo) => {
    return API.post(`/reservas/${reservaId}/cancelar`, { motivo });
  }
};

export default reservaService;