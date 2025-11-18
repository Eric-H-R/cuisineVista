import API from '../../../services/api'
import { createApiService }  from '../../../services/apiFactory'

const horariosService = {
  getBySucursal: (sucursalId) => {
    return API.get(`/horarios/${sucursalId}`);
  },

  getById: (idHorario) => {
    return API.get(`/horarios/id/${idHorario}`);
  },

  // Crear horario
  create: (horarioData) => {
    return API.post('/horarios', horarioData);
  },

  // Actualizar horario
  update: (idHorario, horarioData) => {
    return API.put(`/horarios/id/${idHorario}`, horarioData);
  },

  // Desactivar horario (soft delete)
  delete: (idHorario) => {
    return API.delete(`/horarios/id/${idHorario}`);
  },

  // Asignar horario a usuario
  asignar: (asignacionData) => {
    return API.post('/horarios/asignar', asignacionData);
  },

  // Generar códigos de turno
  generarCodigos: (generacionData) => {
    return API.post('/horarios/generar-codigos', generacionData);
  },

  // Obtener código de turno específico
  getCodigoTurno: (turnoData) => {
    return API.post('/horarios/turno-codigo', turnoData);
  },

  // Obtener horario de usuario
  getByUsuario: (usuarioId) => {
    return API.get(`/horarios/usuario/${usuarioId}`);
  },

  // Obtener usuarios asignados a un horario
  getUsuariosAsignados: (idHorario) => {
     return API.get(`/horarios/usuarios_asignados/${idHorario}`);
  }
};

export default horariosService;