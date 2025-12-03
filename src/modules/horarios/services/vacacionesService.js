import API from "../../../services/api";

export const VacacionesService = {
    // obtener Solicitudes de vacaciones por una sucursal /vacaciones/sucursal/4?estatus=1
    getBySucursal: (sucursalId, params = {}) =>
        API.get("/vacaciones/sucursal/" + sucursalId, { params }),
    //obtener solicityd por ID vacaciones/id_solicitud
    getById: (id) => API.get(`/vacaciones/${id}`),
    aprobar: (id) => API.post(`/vacaciones/${id}/aprobar`),
    rechazar: (id) => API.post(`/vacaciones/${id}/rechazar`),
};

export default VacacionesService;