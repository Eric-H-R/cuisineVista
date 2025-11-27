import API from '../../../services/api';

const PagosService = {
    // Obtener orden abiertas y que se requiere cerrar sin pago
    // método Patch api/pedidos/pedido_id/completar
    cerrarPedido: (pedido_id) => API.patch(`/pedidos/${pedido_id}/completar`),

    // Enlistar pedidos pendientes en la sucursal para posterior cerrar en caso de 
    // que el cliente no lo haga desde la aplicación móvil
    //api/cocina/pedidos 
    obtenerPedidosPendientes: (data) => API.post('/pedidos/listar', data),
    /* Enviar JSON:
       {
  "estado": 0, // este estado es 0 porque quiero traer todos los pedidos de la sucursal con estatus 0 para posteror usar cerrarPedido para cambiar el estatus a 3
  "fecha_desde": "string",
  "fecha_hasta": "string",
  "sucursal_id": 0,
  "tipo_pedido": 0
}
    */
    
    // obtener pagos pendientes de una sucursal 
    // enviar el objeto directamente como body: { sucursal_id: number }
    obtenerPagosPendientes: (data) => API.post('/pagos/pendientes', data),
    // Respuesta JSON:
    /*
    {
    "pedidos": [
        {
            "cliente_id": 2,
            "created_at": "2025-11-26T05:06:37.909499",
            "estado_pedido": 3,
            "folio": "PED-20251126050638",
            "id_pedido": 10,
            "items": [
                {
                    "cantidad": 1,
                    "combo_id": null,
                    "estatus": 3,
                    "id_pedido_item": 11,
                    "nombre": "Huevos revueltos",
                    "notas": "string",
                    "precio_unit": 100.21,
                    "producto_id": 3,
                    "subtotal": 100.21,
                    "tipo": "producto"
                },
                {
                    "cantidad": 2,
                    "combo_id": null,
                    "estatus": 3,
                    "id_pedido_item": 12,
                    "nombre": "adasdasdas",
                    "notas": "string",
                    "precio_unit": 277.75,
                    "producto_id": 8,
                    "subtotal": 555.5,
                    "tipo": "producto"
                }
            ],
            "mesa_id": 2,
            "notas": "Sin picante",
            "pago_estatus": null,
            "pago_id": null,
            "sucursal_id": 4,
            "tiene_pago": false,
            "tipo_pedido": 1,
            "tipo_pedido_display": "Dine-in",
            "total": 655.71
        }
    ],
    "success": true,
    "sucursal_id": 4,
    "total": 2
}
    */
   // Crear un pago para un pedido
   // método POST api/pagos
   crearPago: (data) => API.post('/pagos', data),
   // JSON A ENVIAR 
    /*
{
  "campania_usuario_id": 0,
  "moneda": "string",
  "monto": 0,
  "monto_descontado": 0,
  "pedido_id": 0,
  "propina": 0,
  "sucursal_id": 0
}
    */
   // Cupón de descuento
   // primero obtengo el cliente_id del pedido
   // luego hago post a api/campanias/cupones/validad
    validarCupon: (data) => API.post('/campanias/cupones/validar', data)
    // JSON A ENVIAR
    /*
    {
  "cliente_id": 0,
  "codigo": "string"
}
  Json que regresa
  {
    "campania": {
        "codigo": "VIP678",
        "created_at": "2025-11-26T07:37:43.950414",
        "estatus": 1,
        "estatus_display": "Activa",
        "id_campania": 5,
        "nombre_campania": "KAKAKAK",
        "porcentaje_desc": 10.0,
        "usuario_crea_id": 1
    },
    "campania_usuario_id": 7,
    "porcentaje_desc": 10.0,
    "valido": true
}
    */
};

export default PagosService ;