import API from "../../../services/api";

export const MenuService = {
  // Obtener menús filtrando por sucursal. params puede incluir { activo: true }
  
    create: (data) => API.post("/categorias", data),
    // JSON structure: { descripcion, nomnbre} {"descripcion": "Platillos de desayuno",  "nombre": "Desayunos"}
    getById: (id) => API.get(`/categorias/${id}`),
    update: (id, data) => API.put(`/categorias/${id}`, data),
    delete: (id) => API.delete(`/categorias/${id}`),
    getAll: (params = {}) => API.get("/categorias", { params })
};

export default MenuService;