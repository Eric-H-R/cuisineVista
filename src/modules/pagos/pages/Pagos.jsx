import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  Paper,
  Grid,
  Snackbar,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import  PagosService  from '../services/PagosService';
import { useAuth } from '../../../context/AuthContext';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaymentIcon from '@mui/icons-material/Payment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Colores  from '../../../theme/colores.js';

const Caja = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cuponDialog, setCuponDialog] = useState(false);
  const [pagoDialog, setPagoDialog] = useState(false);
  const [detalleDialog, setDetalleDialog] = useState(false);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [campaniaUsuarioId, setCampaniaUsuarioId] = useState(0);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [finalizarDialogOpen, setFinalizarDialogOpen] = useState(false);
  const [pedidosParaFinalizar, setPedidosParaFinalizar] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [orderToClose, setOrderToClose] = useState(null);



 

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  // Auth (sucursal, user) para obtener sucursal_id y cliente fallback
  const { sucursal, user } = useAuth();

  // Obtener pedidos pendientes de pago
  const obtenerPagosPendientes = async () => {
    setLoading(true);
    try {
      
      const resolveSucursalId = () => {
        if (!sucursal) return null;
        if (typeof sucursal === 'object') return sucursal.id ?? sucursal.sucursalId ?? null;
        const n = Number(sucursal);
        return Number.isNaN(n) ? null : n;
      };

      const sucursalId = resolveSucursalId();
      if (!sucursalId) {
        showAlert('Selecciona una sucursal para cargar los pagos', 'warning');
        setPedidosPendientes([]);
        setPedidoSeleccionado(null);
        setLoading(false);
        return;
      }

      const response = await PagosService.obtenerPagosPendientes({ sucursal_id: sucursalId });

      if (response.data?.success) {
        setPedidosPendientes(response.data.pedidos || []);
        if (response.data.pedidos?.length > 0) {
          setPedidoSeleccionado(response.data.pedidos[0]);
        } else {
          setPedidoSeleccionado(null);
          showAlert("No hay pedidos pendientes")
        }
      }
    } catch (error) {
     console.log("error", error)
    } finally {
      setLoading(false);
    }
  };

  // Abrir dialog para enlistar pedidos pendientes y permitir cerrar
  const openFinalizarDialog = async () => {
    setLoading(true);
    try {
      const resolveSucursalId = () => {
        if (!sucursal) return null;
        if (typeof sucursal === 'object') return sucursal.id ?? sucursal.sucursalId ?? null;
        const n = Number(sucursal);
        return Number.isNaN(n) ? null : n;
      };

      const sucursalId = resolveSucursalId();
      if (!sucursalId) {
        showAlert('Selecciona una sucursal antes de listar pedidos pendientes', 'warning');
        setLoading(false);
        return;
      }

      // usar el endpoint que lista pedidos pendientes para finalizar
      const res = await PagosService.obtenerPedidosPendientes(sucursalId);
      const items = res?.data?.pedidos ?? [];
      setPedidosParaFinalizar(items);
      setSearchTerm('');
      setFinalizarDialogOpen(true);
    } catch (err) {
      console.error('Error obteniendo pedidos pendientes para finalizar:', err);
      showAlert('Error al obtener pedidos pendientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (term) => {
    setSearchTerm(term);
  };

  const filteredPedidosParaFinalizar = pedidosParaFinalizar.filter((p) => {
    if (!searchTerm) return true;
    const t = searchTerm.toString().toLowerCase();
    return (
      (p.id_pedido && p.id_pedido.toString().includes(t)) ||
      (p.folio && p.folio.toLowerCase().includes(t)) ||
      (p.mesa_id && p.mesa_id.toString().includes(t))
    );
  });

  const openConfirmClose = (pedido) => {
    setOrderToClose(pedido);
    setConfirmCloseOpen(true);
  };

  const confirmClose = async () => {
    if (!orderToClose) return;
    try {
      await PagosService.cerrarPedido(orderToClose.id_pedido);
      showAlert('Pedido cerrado correctamente');
      setPedidosParaFinalizar((prev) => prev.filter((p) => p.id_pedido !== orderToClose.id_pedido));
      setConfirmCloseOpen(false);
      setOrderToClose(null);
      await obtenerPagosPendientes();
    } catch (err) {
      showAlert('Error cerrando pedido', 'error');
    }
  };

  const handleSelectPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setDetalleDialog(true);
  };

  
  // Validar cupón de descuento
const validarCupon = async () => {
  if (!pedidoSeleccionado || !codigoCupon.trim()) return;
  try {
    const clienteId = pedidoSeleccionado.cliente_id ?? user?.id ?? null;
    if (!clienteId) {
      showAlert('No se encontró cliente asociado al pedido', 'error');
      return;
    }

    const data = {
      cliente_id: clienteId,
      codigo: codigoCupon
    };

    const response = await PagosService.validarCupon(data);

    if (response.data?.valido) {
      // Calcular el monto descontado basado en el porcentaje si viene así
      const porcentajeDescuento = response.data.porcentaje_desc ?? response.data.porcentaje ?? 0;
      const montoDescontado = response.data.monto_descontado ?? ((pedidoSeleccionado.total * porcentajeDescuento) / 100) ?? 0;
      const campaniaId = response.data.campania_usuario_id ?? response.data.campania_usuario?.id ?? 0;

      setDescuentoAplicado(montoDescontado);
      setCampaniaUsuarioId(campaniaId);
      showAlert(`Cupón aplicado: -${formatCurrency(montoDescontado)}`);
      setCuponDialog(false);
      setCodigoCupon('');
    } else {
      // limpiar cualquier descuento previo
      setDescuentoAplicado(0);
      setCampaniaUsuarioId(0);
      showAlert('Cupón inválido o expirado', 'error');
    }
  } catch (error) {
    console.error('Error al validar cupón:', error);
    showAlert('Error al validar el cupón', 'error');
  }
};

// Procesar pago
const procesarPago = async () => {
  if (!pedidoSeleccionado) return;

  try {
    const totalConDescuento = pedidoSeleccionado.total - descuentoAplicado;

    const dataPago = {
      pedido_id: pedidoSeleccionado.id_pedido,
      sucursal_id: pedidoSeleccionado.sucursal_id,
      monto: pedidoSeleccionado.total, 
      monto_descontado: descuentoAplicado ? totalConDescuento : 0, 
      moneda: 'MXN',
      propina: 0,
      campania_usuario_id: campaniaUsuarioId || null
    };

    console.log('Datos de pago enviados:', dataPago);

    await PagosService.crearPago(dataPago);
    showAlert('Pago procesado exitosamente');
    setPagoDialog(false);
    setDescuentoAplicado(0);
    setCampaniaUsuarioId(null);
    setDetalleDialog(false);
    await obtenerPagosPendientes();
  } catch (error) {
    console.error('Error al procesar pago:', error);
    showAlert('Error al procesar el pago', 'error');
  }
 
};

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  useEffect(() => {
    obtenerPagosPendientes();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Cargando pedidos...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        backgroundColor: Colores.background,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9))",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          borderBottom: `2px solid ${Colores.accent.light}`,
          pb: 2,
        }}
      >
        <RestaurantIcon
          sx={{ fontSize: 48, color: Colores.accent.light, mb: 2 }}
        />
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: Colores.primary.dark,
            fontFamily: '"Playfair Display", serif',
            fontWeight: 300,
            letterSpacing: 2,
          }}
        >
          Caja - Sistema de Cobro
        </Typography>
        
      </Box>

      {/* Selección de pedidos pendientes: mostrar cards para cada pedido */}
      {pedidosPendientes.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          No hay pedidos pendientes de pago
        </Alert>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            borderBottom: `2px solid ${Colores.accent.light}`,
            pb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: Colores.accent.light,
              fontStyle: "italic",
              fontSize: "1.5rem",
              mb: 4,
            }}
          >
            Tickets activos
          </Typography>

          <Grid container spacing={2} sx={{ mb: 10 }}>
            {pedidosPendientes.map((pd) => (
              <Grid size={{xs:12, md:6, lg:4}} key={pd.id_pedido}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    position: "relative",
                    border: "none",
                    background: `${Colores.accent.light}25`,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    "&::before, &::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: "8px",
                      background: `
            radial-gradient(circle at 12px 4px, white 4px, transparent 4px),
            radial-gradient(circle at 12px 4px, #bfbcbcff 5px, transparent 5px)
          `,
                      backgroundSize: "24px 8px",
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: "0 0",
                    },
                    "&::before": {
                      top: "-4px",
                    },
                    "&::after": {
                      bottom: "-4px",
                      transform: "rotate(180deg)",
                    },
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                    },
                  }}
                  onClick={() => handleSelectPedido(pd)}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      m: "8px 0",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                   
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: "1.2rem",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {pd.folio}
                        </Typography>
                        <Box>
                          <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: "0.85rem",
                          }}
                        >
                          CLIENTE #{pd.cliente_id}
                        </Typography>
                        </Box>
                        
                      </Box>
                  </Box> 
                
                    {/* Línea punteada interna */}
                    <Box
                      sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: "1px dashed #7a5b5bff",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: '"Courier New", monospace', fontSize:15 }}
                      >
                        MESA #{pd.mesa_id}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: '"Courier New", monospace', fontSize:13 }}
                      >
                        {pd.items?.length || 0} PRODUCTOS
                      </Typography>
                    </Box>
                     <Box sx={{ textAlign: "end",  mt:3 }}>
                        
                        <Chip
                          label={formatCurrency(pd.total)}
                          color="primary"
                          size="small"
                          sx={{
                            fontFamily: '"Courier New", monospace',
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            bgcolor: Colores.primary.dark,
                            color: "white",
                          }}
                        />
                      </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Dialog que muestra la vista detallada del pedido seleccionado */}
      <Dialog
        open={detalleDialog}
        onClose={() => setDetalleDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{bgcolor: Colores.primary.dark, color: 'white', mb:2, justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
          Detalle del Pedido
          <Button onClick={() => setDetalleDialog(false)} sx={{color:'white'}}><CloseIcon /></Button>
        </DialogTitle>
        <DialogContent>
          {pedidoSeleccionado && (
            <Card
              sx={{
                
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Reutilizamos la estructura del pedido */}
                <Box sx={{ p: 3 }}>
                  {/* Header del Pedido */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color={Colores.accent.dark}
                        sx={{ fontWeight: "bold" }}
                      >
                        CLIENTE ID
                      </Typography>
                      <Typography variant="h6" color={Colores.primary}>
                        #{pedidoSeleccionado.cliente_id}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color={Colores.secondary}
                        sx={{ fontWeight: "bold" }}
                      >
                        NÚMERO DE PEDIDO
                      </Typography>
                      <Typography variant="h6" color={Colores.primary}>
                        {pedidoSeleccionado.folio}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color={Colores.secondary}
                        sx={{ fontWeight: "bold" }}
                      >
                        FECHA DEL PEDIDO
                      </Typography>
                      <Typography variant="h6" color={Colores.primary}>
                        {formatDate(pedidoSeleccionado.created_at)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tabla de Productos */}
                  <TableContainer
                    component={Paper}
                    sx={{
                      boxShadow: "none",
                      border: `1px solid ${Colores.accent.dark}`,
                    }}
                  >
                    <Table>
                      <TableHead
                        sx={{ backgroundColor: `${Colores.accent.dark}40` }}
                      >
                        <TableRow>
                          <TableCell
                            sx={{ color: Colores.accent.dark, fontWeight: "bold" }}
                          >
                            ID Producto
                          </TableCell>
                          <TableCell
                            sx={{ color: Colores.accent.dark, fontWeight: "bold" }}
                          >
                            Nombre del Producto
                          </TableCell>
                          <TableCell
                            sx={{ color: Colores.accent.dark, fontWeight: "bold" }}
                          >
                            Precio Unitario
                          </TableCell>
                          <TableCell
                            sx={{ color: Colores.accent.dark, fontWeight: "bold" }}
                          >
                            Subtotal
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pedidoSeleccionado.items?.map((item) => (
                          <TableRow
                            key={item.id_pedido_item}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell sx={{ color: Colores.secondary }}>
                              #{item.producto_id}
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight="medium">
                                {item.nombre}
                              </Typography>
                              {item.notas && (
                                <Typography
                                  variant="caption"
                                  color={Colores.secondary}
                                  fontStyle="italic"
                                >
                                  Notas: {item.notas}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ color: Colores.secondary }}>
                              {formatCurrency(item.precio_unit)}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: Colores.primary,
                                fontWeight: "bold",
                              }}
                            >
                              {formatCurrency(item.subtotal)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Footer con Información del Pedido */}
                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      backgroundColor: `${Colores.secondary}08`,
                      borderRadius: 2,
                      border: `1px solid ${Colores.secondary}20`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "repeat(3, 1fr)",
                        },
                        gap: 3,
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color={Colores.secondary}
                          sx={{ fontWeight: "bold" }}
                        >
                          MESA
                        </Typography>
                        <Typography variant="h6" color={Colores.primary}>
                          #{pedidoSeleccionado.mesa_id}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color={Colores.secondary}
                          sx={{ fontWeight: "bold" }}
                        >
                          SUCURSAL
                        </Typography>
                        <Typography variant="h6" color={Colores.primary}>
                          #{pedidoSeleccionado.sucursal_id}
                        </Typography>
                      </Box>
                      <Box sx={{ backgroundColor: `${Colores.accent.dark}40`, display: "flex", p: 1, borderRadius: 1, justifyContent: "center", alignItems: "center"  }}>
                        <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>

                        <Typography
                          variant="caption"
                          color={Colores.accent.dark}
                          sx={{ fontWeight: "bold", fontSize: '1rem'  }}
                        >
                          TOTAL
                        </Typography>
                        </Box>
                        <Typography
                          variant="h4"
                          color={Colores.accent.dark}
                          sx={{ fontFamily: '"Playfair Display", serif' }}
                        >
                          <Typography variant="h4" color="primary" sx={{ fontFamily: '"Playfair Display", serif' }}>
                            {formatCurrency(pedidoSeleccionado.total - descuentoAplicado)}
                          </Typography>
                        </Typography>
                        {descuentoAplicado > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">
                                  Subtotal:
                                </Typography>
                                <Typography variant="caption">
                                  {formatCurrency(pedidoSeleccionado.total)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="success.main">
                                  Descuento:
                                </Typography>
                                <Typography variant="caption" color="success.main">
                                  -{formatCurrency(descuentoAplicado)}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                      </Box>
                    </Box>

                    {pedidoSeleccionado.notas && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="caption"
                          color={Colores.secondary}
                          sx={{ fontWeight: "bold" }}
                        >
                          NOTAS ESPECIALES:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontStyle: "italic", color: Colores.secondary }}
                        >
                          "{pedidoSeleccionado.notas}"
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Botones de Acción dentro del Dialog */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mt: 4, justifyContent: "center" }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<LocalOfferIcon sx={{color: Colores.status.error}}/>}
                      onClick={() => setCuponDialog(true)}
                      sx={{
                        color: Colores.primary.dark,
                        fontWeight: "bold",
                        borderColor: Colores.primary.dark,
                      }}
                    >
                      Cupón de Descuento
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={() => setPagoDialog(true)}
                      sx={{ backgroundColor: Colores.primary.dark }}
                    >
                      Proceder al Pago
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para listar pedidos pendientes a cerrar para proceder al pago */}
      <Dialog open={finalizarDialogOpen} onClose={() => setFinalizarDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{bgcolor: Colores.primary.dark, color: 'white', mb:2, justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>Pedidos pendientes
      
          <Button onClick={() => setFinalizarDialogOpen(false)} sx={{color:'white'}}><CloseIcon /></Button>
       
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>Los pedidos son activos hasta que se cierran manualmente. 
            En caso de que el cliente no cierre su pedido desde movil </Alert>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Buscar por folio, id o mesa"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </Box>
          <Grid container spacing={2}>
            {filteredPedidosParaFinalizar.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">No se encontraron pedidos pendientes.</Alert>
              </Grid>
            ) : (
              filteredPedidosParaFinalizar.map((pd) => (
                <Grid size={12} key={pd.id_pedido}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography fontWeight="bold">{pd.folio}</Typography>
                          <Typography variant="caption">Mesa # {pd.mesa_id}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" color={Colores.primary}>
                        {pd.id_pedido}
                          </Typography>
                        </Box>
                        <Box>
                          <Button variant="contained" color="error" onClick={() => openConfirmClose(pd)}>Cerrar pedido</Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar cierre de pedido */}
      <Dialog open={confirmCloseOpen} onClose={() => setConfirmCloseOpen(false)}>
        <DialogTitle>Confirmar cierre</DialogTitle>
        <DialogContent>
          <Typography>¿Deseas cerrar el pedido {orderToClose?.folio} (ID {orderToClose?.id_pedido})?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCloseOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmClose}>Cerrar pedido</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Cupón */}
      <Dialog
        open={cuponDialog}
        onClose={() => setCuponDialog(false)}
        PaperProps={{
          sx: {
            border: `2px solid ${Colores.primary}20`,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: Colores.accent.dark, textAlign: "center" }}>
          <LocalOfferIcon sx={{ mr: 1, color: Colores.status.error }} />
          Aplicar Cupón de Descuento
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Código del Cupón"
            type="text"
            fullWidth
            variant="outlined"
            value={codigoCupon}
            onChange={(e) => setCodigoCupon(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setCuponDialog(false)}
            sx={{ color: Colores.accent.dark }}
          >
            Cancelar
          </Button>
          <Button
            onClick={validarCupon}
            variant="contained"
            sx={{ backgroundColor: Colores.primary.dark }}
          >
            Validar Cupón
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Pago */}
      <Dialog
        open={pagoDialog}
        onClose={() => setPagoDialog(false)}
        PaperProps={{
          sx: {
            border: `2px solid ${Colores.primary}20`,
            borderRadius: 2,
            p:5
          },
        }}
      >
        <DialogTitle sx={{ color: Colores.accent.dark, textAlign: "center", fontSize:30, justifyContent: "center", display: "flex", alignItems: "center"  }}>
          <ReceiptIcon sx={{ mr: 1, color: Colores.accent.dark, fontSize: 40 }} />
          Confirmar Pago
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2, }}>
            <Box sx={{ mb: 2, bgcolor: `${Colores.accent.dark}40`, borderRadius: 2, p:2  }}>
            <Typography variant="h6" gutterBottom>
              Total a Pagar
            </Typography>
            <Typography
              variant="h4"
              
              sx={{ fontFamily: '"Playfair Display", serif' }}
            >
              {formatCurrency(pedidoSeleccionado?.total - descuentoAplicado)}
            </Typography>
            </Box>
            {descuentoAplicado > 0 && (
              <Typography variant="body2" color={Colores.accent} sx={{ mt: 1 }}>
                Descuento aplicado: -{formatCurrency(descuentoAplicado)}
              </Typography>
            )}

            {/* Selección de método de pago */}
            <Box sx={{ mt: 2, textAlign: "left" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Método de pago
              </Typography>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="efectivo"
                  control={<Radio />}
                  label="Efectivo"
                />
                <FormControlLabel
                  value="tarjeta"
                  control={<Radio />}
                  label="Tarjeta"
                />
                <FormControlLabel
                  value="mixto"
                  control={<Radio />}
                  label="Mixto"
                />
              </RadioGroup>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setPagoDialog(false)}
            sx={{ color: Colores.accent.dark }}
          >
            Cancelar
          </Button>
          <Button
            onClick={procesarPago}
            variant="contained"
            sx={{ backgroundColor: Colores.primary.dark }}
            startIcon={<PaymentIcon />}
          >
            Confirmar Pago
          </Button>
        </DialogActions>
      </Dialog>

     {/* Pedidos no finalizados */}
     <Box
        sx={{
          textAlign: "center",
          mb: 4,
          pb: 2,
        }}
      >
        <Typography
            variant="subtitle1"
            sx={{
              color: Colores.accent.light,
              fontStyle: "italic",
              fontSize: "1.5rem",
              mb: 4,
            }}
          >
            Finalizar pedidos para cliente
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={openFinalizarDialog} sx={{ borderColor: Colores.primary.light, color: Colores.primary.dark }}>Finalizar pedido</Button>
        </Stack>
      </Box>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Caja;