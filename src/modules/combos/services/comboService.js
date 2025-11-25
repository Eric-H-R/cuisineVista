import API from "../../../services/api";

export const TicketService = {
    // obtener Todos los combos
    getCombos: () => API.get("/combos"),
    /* Respuesta JSON:
    {
    "data": [
        {
            "created_at": "2025-11-09 05:08:00",
            "descripcion": "Combo desayuno individual",
            "es_activo": true,
            "id_combo": 2,
            "imagen_url": "base64string",
            "nombre": "Combo Desayuno",
            "precio": "120.00",
            "updated_at": null
        }
    ],
    "success": true
} */

    // obtener combo por id
    getById: (id) => API.get(`/combos/${id}`),

    // crear nuevo combo
    create: (data) => API.post("/combos", data),
    /*
    {
  "categoria_id": 1,
  "descripcion": "string",
  "imagen_url": "base64string",
  "nombre": "Combo Desayuno",
  "precio": 12.5,
  "productos": [
    {
      "cantidad": 1,
      "producto_id": 1
    }
  ]
} */

    // actualizar combo
    update: (id, data) => API.put(`/combos/${id}`, data),
    /*{
  "descripcion": "string",
  "imagen_url": "string",
  "nombre": "string",
  "precio": 0
} */

    // eliminar combo
    delete: (id) => API.delete(`/combos/${id}`),

    // obtener productos activos del api productos 
    getActiveProducts: () => API.get("/productos", { params: { solo_activos: true } }),
    /*{
    "data": [
        {
            "categoria_id": 1,
            "codigo": "PRO-202511210742",
            "created_at": "2025-11-21 07:42:46",
            "descripcion": "Hola prueba",
            "es_activo": true,
            "id_producto": 5,
            "imagen_url": "djjds",
            "nombre": "Prueba Producto",
            "precio": "50.00",
            "updated_at": null
        }
    ],
    "success": true
} */
};
export default TicketService;

