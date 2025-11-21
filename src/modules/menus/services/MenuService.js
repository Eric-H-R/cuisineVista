import API from "../../../services/api";

export const MenuService = {
  // Obtener menús filtrando por sucursal. params puede incluir { activo: true }
  
    create: (data) => API.post("/categorias", data),
    // JSON structure: { descripcion, nomnbre} {"descripcion": "Platillos de desayuno",  "nombre": "Desayunos"}
    getById: (id) => API.get(`/categorias/${id}`),
    update: (id, data) => API.put(`/categorias/${id}`, data),
    delete: (id) => API.delete(`/categorias/${id}`),
    getAll: (params = {}) => API.get("/categorias", { params })
    /* respuesta 
    {
    "data": [
        {
            "created_at": "2025-11-09 02:21:19",
            "descripcion": "Platillos de desayuno act",
            "es_activa": true,
            "id_categoria": 1,
            "nombre": "Desayunos act",
            "updated_at": null
        }
    ],
    "success": true
}*/
};

export default MenuService;