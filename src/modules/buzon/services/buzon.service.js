import API from "../../../services/api";

export const BuzonService = {

    // obtener todas las mejoras/sugerencias 
    // api/mejoras
    // Respuesta JSON:
    /*
    {
    "data": [
        {
            "cliente_id": 1,
            "created_at": "2025-11-21T23:45:17.046666",
            "estatus": 1,
            "id_mejora": 3,
            "notas": "seria bueno que funcionara El modulo xd"
        },
    ],
    "success": true
} */

    getAll: (params = {}) => API.get('/mejoras', { params })
};

export default BuzonService;