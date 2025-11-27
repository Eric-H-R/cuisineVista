// Generar nombres de campaña sugeridos según el tipo
export const generarNombreCampania = (tipoMetrica, parametros = {}) => {
  const fecha = new Date();
  const mes = fecha.toLocaleString('es-MX', { month: 'long' });
  const año = fecha.getFullYear();

  const nombres = {
    clientes_vip: `Club VIP ${mes} ${año}`,
    clientes_frecuentes: `Fidelidad ${mes} ${año}`,
    clientes_inactivos: `Te Extrañamos ${mes} ${año}`,
    clientes_nuevos: `Bienvenida ${mes} ${año}`,
    clientes_por_canal: `Experiencia Personalizada ${mes} ${año}`
  };

  return nombres[tipoMetrica] || `Campaña ${mes} ${año}`;
};

// Generar códigos de cupón únicos
export const generarCodigoCupon = (tipoMetrica) => {
  const prefijos = {
    clientes_vip: 'VIP',
    clientes_frecuentes: 'FREQ',
    clientes_inactivos: 'EXTR',
    clientes_nuevos: 'BIEN',
    clientes_por_canal: 'PREF'
  };

  const prefijo = prefijos[tipoMetrica] || 'CAMP';
  const numero = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefijo}${numero}`;
};

// Calcular porcentaje de descuento sugerido
export const calcularDescuentoSugerido = (tipoMetrica) => {
  const descuentos = {
    clientes_vip: 20,
    clientes_frecuentes: 15,
    clientes_inactivos: 25, // Mayor descuento para reactivar
    clientes_nuevos: 10,
    clientes_por_canal: 15
  };

  return descuentos[tipoMetrica] || 10;
};

// Formatear descripción de métrica para mostrar
export const formatearDescripcionMetrica = (metricaData) => {
  if (!metricaData) return '';
  
  const { metrica, descripcion, total, resumen_canales } = metricaData;
  
  let texto = descripcion || '';
  
  if (total !== undefined) {
    texto += ` - ${total} cliente${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
  }
  
  if (resumen_canales) {
    const canales = Object.entries(resumen_canales)
      .map(([canal, count]) => `${canal.replace('_PREFERIDO', '')}: ${count}`)
      .join(', ');
    texto += ` (${canales})`;
  }
  
  return texto;
};

// Agrupar clientes por segmento para análisis
export const agruparPorSegmento = (clientes) => {
  return clientes.reduce((grupos, cliente) => {
    const segmento = cliente.segmento || 'SIN_SEGMENTO';
    if (!grupos[segmento]) {
      grupos[segmento] = [];
    }
    grupos[segmento].push(cliente);
    return grupos;
  }, {});
};