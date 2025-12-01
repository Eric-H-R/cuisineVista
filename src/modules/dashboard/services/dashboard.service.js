import API from "../../../services/api";

const dashboardService = {
  // Calificaciones
  getPromedioCalificaciones: (filtros) => {
    return API.post('/dashboard/calificaciones/promedio', filtros);
  },
  
  getTopEmpleados: (filtros) => {
    return API.post('/dashboard/calificaciones/top-empleados', filtros);
  },

  // Inventario
  getBajoStock: (sucursalId) => {
    return API.post('/dashboard/inventario/bajo-stock', { sucursal_id: sucursalId });
  },

  getLotesVencidos: (sucursalId) => {
    return API.post('/dashboard/inventario/lotes-vencidos', { 
      sucursal_id: sucursalId 
    });
  },

  getLotesPorVencer: (sucursalId, dias = 30) => {
    return API.post('/dashboard/inventario/lotes-por-vencer', { 
      sucursal_id: sucursalId,
      dias: dias
    });
  },

  //Pedidos
  getEstadosPedidos: (filtros) => {
    return API.post('/dashboard/pedidos/estados', filtros);
  },

  getPedidosPorHora: (filtros) => {
    return API.post('/dashboard/pedidos/horas', filtros);
  },

  getTiposPedidos: (filtros) => {
    return API.post('/dashboard/pedidos/tipos', filtros);
  },

  getTopProductos: (filtros) => {
    return API.post('/dashboard/pedidos/top-productos', filtros);
  },

  getTopCombos: (filtros) => {
    return API.post('/dashboard/pedidos/top-combos', filtros);
  },


  //Reserva
  getEstadosReservas: (filtros) => {
    return API.post('/dashboard/reservas/estados', filtros);
  },

  getTasaNoShow: (filtros) => {
    return API.post('/dashboard/reservas/tasa-noshow', filtros);
  },

  //Ventas
  getVentasPeriodo: (filtros) => {
    return API.post('/dashboard/ventas/periodo', filtros);
  },

  getVentasSucursales: (filtros) => {
    return API.post('/dashboard/ventas/sucursales', filtros);
  }
};

export default dashboardService