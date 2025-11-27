import API from '../../../services/api';

const campaniasService = {
  // Obtener todas las campañas
  getAll: () => {
    return API.get('/campanias');
  },

  // Activar campaña
  activar: (campaniaId) => {
    return API.post(`/campanias/${campaniaId}/activar`);
  },

  // Desactivar campaña
  desactivar: (campaniaId) => {
    return API.post(`/campanias/${campaniaId}/desactivar`);
  },

  // Generar campaña desde métrica
  generarDesdeMetrica: (campaniaData) => {
    return API.post('/campanias/generar-desde-metrica', campaniaData);
  },

  // Métricas
  getClientesVIP: (topN = 20) => {
    return API.post('/campanias/metricas/clientes-vip', { top_n: topN });
  },

  getClientesFrecuentes: (topN = 20) => {
    return API.post('/campanias/metricas/frecuentes', { top_n: topN });
  },

  getClientesInactivos: (diasSinComprar = 30) => {
    return API.post('/campanias/metricas/inactivos', { dias_sin_comprar: diasSinComprar });
  },

  getClientesNuevos: (diasRegistro = 30) => {
    return API.post('/campanias/metricas/nuevos', { dias_registro: diasRegistro });
  },

  getClientesPorCanal: () => {
    return API.post('/campanias/metricas/por-canal', {});
  }
};

export default campaniasService;