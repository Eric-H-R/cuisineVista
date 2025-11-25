import API from "../../../services/api";


export const ConfigService = {
  // Crear una nueva configuración
    create: (data) => API.post("/config", data),
    /* JSON que se envía
    {
    "clave": "descuento",
    "sucursal_id": 4,
    "valor_string": "200"
    }
    // Este ejemplo crea una configuración de descuento de 200 para la sucursal 4
    // la cual puede ser usada para aplicar descuentos en ventas
    */
   // Obtener configuración por clave y sucursal
    getByClaveAndSucursal: (clave, sucursalId) =>
      API.get("/config", { params: { clave: clave, sucursal_id: sucursalId } }),
    /* Respuesta ejemplo:
    {
        "data": {
        "clave": "Descuento",
        "id_config": 1,
        "sucursal_id": 4,
        "updated_at": "2025-11-22T17:31:10.590000",
        "valor_string": "200"
    },
    "success": true
}
    */
   // Listar todas las configuraciones para una sucursal
    listBySucursal: (sucursalId) =>
      API.get("/config/sucursal/" + sucursalId),
    /* Respuesta ejemplo:
    {
    "data": [
        {
            "clave": "Descuento",
            "id_config": 1,
            "sucursal_id": 4,
            "updated_at": "2025-11-22T17:31:10.590000",
            "valor_string": "200"
        }
    ],
    "success": true
}
    */
   // Eliminar configuración por sucursalId y clave
   // config?sucursal_id=4&clave=promo
    deleteBySucursalAndClave: (sucursalId, clave) =>
      API.delete("/config", { params: { sucursal_id: sucursalId, clave: clave } })
};

export default ConfigService;