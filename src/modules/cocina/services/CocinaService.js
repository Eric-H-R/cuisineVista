import API from "../../../services/api";

export const CocinaService = {
    // voy a hacer post cada que quiera actualizar todos los items existentes.
   // se envía solo { "sucursal_id": number }
   postPendientes: (data) => API.post('/cocina/pendientes', data),
   // Respuesta JSON:
   /*
   {
    "items": [
        {
            "cantidad": 1,
            "combo_id": null,
            "created_at": "2025-11-26T06:53:22.820676",
            "estatus_detalle": 1,
            "folio_pedido": "PED-20251126065322",
            "id_pedido_item": 13,
            "mesa_id": 4,
            "notas": "string",
            "pedido_id": 11,
            "producto_id": 3,
            "producto_nombre": "Huevos revueltos",
            "tiempo_en_cocina": "4 min",
            "tipo_pedido": 1,
            "tipo_pedido_display": "Dine-in"
        }
    ],
    "total": 1
}
   */

   // put para actualizar el estado de un item en cocina como listo de 1 a 2
   //api/cocina/item/13/listo
   itemListo: (id_pedido_item) => API.put(`/cocina/item/${id_pedido_item}/listo`)
    // Respuesta JSON:
    /*
    {
    "item": {
        "cantidad": 1,
        "combo_id": null,
        "created_at": "2025-11-26T06:53:22.820676",
        "estatus_detalle": 2,
        "estatus_nombre": "Listo",
        "id_pedido_item": 13,
        "notas": "string",
        "pedido_id": 11,
        "precio_unit": 100.21,
        "producto_id": 3,
        "updated_at": "2025-11-26T07:07:17.160508"
    },
    "message": "Item marcado como listo",
    "pedido_auto_pagado": false
}
    */
}

