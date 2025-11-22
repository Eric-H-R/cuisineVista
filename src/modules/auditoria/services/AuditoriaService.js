import API from "../../../services/api";

export const AuditoriaService = {
    // Obtener registros de auditoría con parámetros opcionales
    getRegistros: (params = {}) =>
        API.get("/auditoria/estadisticas", { params }),
    /*JSON que devuelve
    "data": {
        "periodo_dias": 30,
        "por_accion": [
            {
                "accion": "ACTIVATE",
                "count": 3
        ],
        "por_entidad": [
            {
                "count": 17,
                "entidad": "CREATE"
            },
            
        ],
        "top_usuarios": [
            {
                "count": 219,
                "usuario_id": 1
            }
           
            }
        ],
        "total_logs": 342
    },
    "success": true
}
*/

    postLimpiarRegistros: (data) =>
        API.post("/auditoria/limpiar", data),
    // json que envía { "dias: 90"}

    // Obtener detalles por: Entidad, Accion, Id de usuario, Por origen: web, movil, aPi, system,fecha de inicio y fecha fin
    getDetalles: (params = {}) =>
        API.get("/auditoria/logs", { params }),
    
};
export default AuditoriaService;