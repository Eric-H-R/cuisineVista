import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Checkbox,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import colors from '../../../theme/colores';

const CardCliente = ({ 
  cliente, 
  seleccionado = false, 
  onSeleccionar,
  tipoMetrica 
}) => {
  
  const getSegmentoColor = (segmento) => {
    switch (segmento) {
      case 'VIP': return colors.status.warning;
      case 'FRECUENTE': return colors.primary.main;
      case 'INACTIVO': return colors.status.error;
      case 'NUEVO': return colors.status.success;
      case 'POR_CANAL': return colors.secondary.main;
      case 'EN_RIESGO': return colors.status.warning;
      case 'PERDIDO': return colors.status.error;
      default: return colors.text.disabled;
    }
  };

  const getIniciales = (nombreCompleto) => {
    return nombreCompleto
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderInfoVIP = () => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <MoneyIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
        <Typography variant="body2">
          <strong>Gasto total:</strong> ${cliente.gasto_total}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CartIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
        <Typography variant="body2">
          <strong>Ticket promedio:</strong> ${cliente.ticket_promedio}
        </Typography>
      </Box>
    </>
  );

  const renderInfoFrecuente = () => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CartIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
        <Typography variant="body2">
          <strong>Total interacciones:</strong> {cliente.total_interacciones}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
        <Typography variant="body2">
          <strong>Última visita:</strong> {new Date(cliente.ultima_visita).toLocaleDateString()}
        </Typography>
      </Box>
    </>
  );

  const renderInfoInactivo = () => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CalendarIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
        <Typography variant="body2">
          <strong>Días sin comprar:</strong> {cliente.dias_sin_comprar}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MoneyIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
        <Typography variant="body2">
          <strong>Gasto histórico:</strong> ${cliente.gasto_historico}
        </Typography>
      </Box>
    </>
  );

  const renderInfoNuevo = () => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CalendarIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
        <Typography variant="body2">
          <strong>Días registrado:</strong> {cliente.dias_desde_registro}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CartIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
        <Typography variant="body2">
          <strong>Total pedidos:</strong> {cliente.total_pedidos}
        </Typography>
      </Box>
    </>
  );

  const renderInfoPorCanal = () => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="body2">
          <strong>Canal preferido:</strong> 
        </Typography>
        <Chip 
          label={cliente.canal_preferido?.replace('_PREFERIDO', '') || 'Sin preferencia'}
          size="small"
          variant="outlined"
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="caption">
          <strong>Mesa:</strong> {cliente.pedidos_mesa}
        </Typography>
        <Typography variant="caption">
          <strong>Takeaway:</strong> {cliente.pedidos_takeaway}
        </Typography>
        <Typography variant="caption">
          <strong>Delivery:</strong> {cliente.pedidos_delivery}
        </Typography>
      </Box>
    </>
  );

  const renderInfoSegunMetrica = () => {
    switch (tipoMetrica) {
      case 'clientes_vip': return renderInfoVIP();
      case 'clientes_frecuentes': return renderInfoFrecuente();
      case 'clientes_inactivos': return renderInfoInactivo();
      case 'clientes_nuevos': return renderInfoNuevo();
      case 'clientes_por_canal': return renderInfoPorCanal();
      default: return null;
    }
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        border: seleccionado ? `2px solid ${colors.primary.main}` : `1px solid ${colors.border.light}`,
        bgcolor: seleccionado ? `${colors.primary.main}08` : colors.background.light,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: colors.primary.light,
          boxShadow: 1
        }
      }}
      onClick={() => onSeleccionar(cliente)}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          {/* Checkbox de selección */}
          <Checkbox
            checked={seleccionado}
            onChange={() => onSeleccionar(cliente)}
            sx={{ mt: 0.5 }}
          />

          {/* Avatar */}
          <Avatar 
            sx={{ 
              bgcolor: colors.primary.main,
              width: 48,
              height: 48
            }}
          >
            {getIniciales(cliente.nombre_completo)}
          </Avatar>

          {/* Información del cliente */}
          <Box sx={{ flex: 1 }}>
            {/* Header con nombre y segmento */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color={colors.text.primary}>
                  {cliente.nombre_completo}
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  ID: {cliente.id_usuario}
                </Typography>
              </Box>
              
              <Chip 
                label={cliente.segmento}
                size="small"
                sx={{
                  backgroundColor: getSegmentoColor(cliente.segmento),
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}
              />
            </Box>

            {/* Contacto */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EmailIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
              <Typography variant="body2" color={colors.text.primary}>
                {cliente.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PhoneIcon sx={{ fontSize: 14, color: colors.text.secondary }} />
              <Typography variant="body2" color={colors.text.primary}>
                {cliente.telefono}
              </Typography>
            </Box>

            {/* Información específica de la métrica */}
            {renderInfoSegunMetrica()}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardCliente;