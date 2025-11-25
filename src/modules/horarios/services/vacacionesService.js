import API from "../../../services/api";

export const VacacionesService = {
    // obtener Solicitudes de vacaciones por una sucursal /vacaciones/sucursal/4?estatus=1
    getBySucursal: (sucursalId, params = {}) =>
        API.get("/vacaciones/sucursal/" + sucursalId, { params }),
    //obtener solicityd por ID vacaciones/id_solicitud
    getById: (id) => API.get(`/vacaciones/${id}`),
    // Aprobar solicitud de vacaciones estatus=2
    aprobar: (id, data) => API.post(`/vacaciones/id_solicitud/${id}/aprobar`, data),
    // Rechazar solicitud de vacaciones estatus=3
    rechazar: (id, data) => API.post(`/vacaciones/id_solicitud/${id}/rechazar`, data),
};

export default VacacionesService;