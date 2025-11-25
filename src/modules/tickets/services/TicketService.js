import API from "../../../services/api";

export const TicketService = {
  // Obtener tickets por usuario y estatus 
  // estatus 1= Registrda, 2= EnProceso, 3= Completada, 4= Cancelada
  getTicket: (userId, estatus) => API.get("/tickets", { params: { user_id: userId, estatus } }),
    /* Respuesta ejemplo: 
    "data": [
        {
            "created_at": "2025-11-22T01:33:41.833333",
            "estatus": 1,
            "id_ticket": 2,
            "imagen_url": "base64string",
            "notas": "se cagaron en la mesa",
            "usuario_id": 1
        },
        {
            "created_at": "2025-11-22T01:33:19.096666",
            "estatus": 1,
            "id_ticket": 1,
            "imagen_url": "base64string",
            "notas": "ssssss",
            "usuario_id": 1
        }
    ],
    "success": true
}*/
  
  getById: (id) => API.get(`/tickets/${id}`),
  // Actualizar estatus del ticket
    updateStatus: (id, estatus) => API.patch(`/tickets/${id}/estatus`, { estatus: estatus }),
        // JSON ejemplo que envía: { "estatus": 2 }
};
export default TicketService;