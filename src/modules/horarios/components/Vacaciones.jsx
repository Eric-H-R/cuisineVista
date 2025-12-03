import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Typography, CircularProgress, Select, MenuItem, Tooltip, IconButton, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import VacacionesService from '../services/vacacionesService';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { FilterList } from '@mui/icons-material';
import colors from '../../../theme/colores';


const Vacaciones = () => {
  const { sucursal: authSucursal } = useAuth();
  const [sucursalId, setSucursalId] = useState(authSucursal || '');
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [estatus, setEstatus] = useState('');

  // detail dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  // action confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'aprobar'|'rechazar', id }
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = async (id, estatusParam = '') => {
    if (!id) return setSolicitudes([]);
    setLoading(true);
    try {
      const params = {};
      if (estatusParam) params.estatus = estatusParam;
      console.log('Loading vacaciones for sucursal', id, 'params:', params);
      const res = await VacacionesService.getBySucursal(id, params);
      const payload = res && res.data ? res.data : res;
      console.log('vacaciones get res', payload);
      // backend returns { count: n, solicitudes: [...] }
      let items = [];
      if (Array.isArray(payload.solicitudes)) items = payload.solicitudes;
      else if (Array.isArray(payload.data)) items = payload.data;
      else if (Array.isArray(payload)) items = payload;
      setSolicitudes(items);
    } catch (err) {
      console.error('Error cargando solicitudes', err);
      toast.error('Error cargando solicitudes');
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sucursalId) load(sucursalId, estatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sucursalId, estatus]);

  const handleOpenDetail = (row) => { setDetailRow(row); setDetailOpen(true); };
  const handleCloseDetail = () => { setDetailRow(null); setDetailOpen(false); };

  const openConfirm = (type, id) => { setConfirmAction({ type, id }); setComment(''); setConfirmOpen(true); };
  const closeConfirm = () => { setConfirmAction(null); setConfirmOpen(false); setComment(''); };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const { type, id } = confirmAction;
      const payload = { comentario: comment };
      console.log(`${type} payload:`, payload);
      let res;
      if (type === 'aprobar') res = await VacacionesService.aprobar(id, payload);
      else res = await VacacionesService.rechazar(id, payload);
      console.log('action response', res && res.data ? res.data : res);
      toast.success(type === 'aprobar' ? 'Solicitu aprobada' : 'Solicitud rechazada');
      closeConfirm();
      // reload
      if (sucursalId) load(sucursalId);
    } catch (err) {
      console.error('Error procesando acción', err, err?.response?.data || {});
      const backendMsg = err?.response?.data?.message || err?.response?.data || null;
      if (backendMsg) {
        try { toast.error(typeof backendMsg === 'string' ? backendMsg : JSON.stringify(backendMsg)); } catch { toast.error('Error en la acción'); }
      } else toast.error('Error en la acción');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const s = String(status);
    if (s === '1') return 'En proceso';
    if (s === '2') return 'Aprobada';
    if (s === '3') return 'Rechazada';
    return 'Desconocido';
  };

  const getStatusColor = (status) => {
    const s = String(status);
    if (s === '1') return 'warning';
    if (s === '2') return 'success';
    if (s === '3') return 'error';
    return 'default';
  };

  const isFinalStatus = (status) => {
    const s = Number(status);
    return s === 2 || s === 3;
  };

  return (


    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 4, bgcolor: colors.primary.light, p: 2, borderRadius: 1, boxShadow: 1 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
             Solicitudes de Vacaciones
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra los horarios y turnos de la sucursal
            </Typography>
          </Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold" component="div" sx={{ flexGrow: 0.5, display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ verticalAlign: 'large', mr: 2, ml:3 }} />
          Filtros:
        </Typography>
        <TextField label="Sucursal ID" disabled size="small" value={sucursalId} onChange={(e) => setSucursalId(e.target.value)} />
        <Select size="small" value={estatus} onChange={(e) => setEstatus(e.target.value)} displayEmpty sx={{ minWidth: 280 }}>
          <MenuItem value="">Todos los estatus</MenuItem>
          <MenuItem value={"1"}>Pendiente </MenuItem>
          <MenuItem value={"2"}>Aprobada </MenuItem>
          <MenuItem value={"3"}>Rechazada </MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><LoadingComponent /></Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Desde</TableCell>
              <TableCell>Hasta</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Estatus</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map(s => (
              <TableRow key={s.id_solicitud || s.id}>
                <TableCell>{s.id_solicitud || s.id}</TableCell>
                <TableCell>{s.horario_usuario_id || s.usuario_id || (s.usuario && s.usuario.nombre) || '-'}</TableCell>
                <TableCell>{s.fecha_inicio || s.fecha_desde || s.inicio || '-'}</TableCell>
                <TableCell>{s.fecha_fin || s.fecha_hasta || s.fin || '-'}</TableCell>
                <TableCell>
                  {s.motivo || s.descripcion || s.detalle || '-'}
                </TableCell>
                <TableCell>
                  <Chip label={getStatusLabel(s.estatus ?? s.status)} size="small" color={getStatusColor(s.estatus ?? s.status)} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Ver detalle" arrow>
                      <IconButton size="small" onClick={() => handleOpenDetail(s)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Aceptar" arrow>
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => openConfirm('aprobar', s.id_solicitud || s.id)}
                          disabled={isFinalStatus(s.estatus ?? s.status)}
                          sx={{ border: '1px solid', borderColor: 'divider', color: 'success.main', '&:disabled': { color: 'action.disabled' } }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Rechazar" arrow>
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => openConfirm('rechazar', s.id_solicitud || s.id)}
                          disabled={isFinalStatus(s.estatus ?? s.status)}
                          sx={{ border: '1px solid', borderColor: 'divider', color: 'error.main', '&:disabled': { color: 'action.disabled' } }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* detail dialog */}
      <Dialog open={detailOpen} onClose={handleCloseDetail} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: colors.primary.dark, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">Detalle solicitud</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailRow ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mt: 2 }}>
              <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }} elevation={0}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Información</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                  <Box sx={{ minWidth: 180 }}>
                    <Typography variant="caption" color="text.secondary">ID</Typography>
                    <Typography>{detailRow.id_solicitud || detailRow.id}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">Usuario</Typography>
                    <Typography>{detailRow.horario_usuario_id || detailRow.usuario_id || detailRow.usuario?.nombre || '-'}</Typography>
                  </Box>
                 
                  <Box sx={{ minWidth: 180 }}>
                    <Typography variant="caption" color="text.secondary">Desde</Typography>
                    <Typography>{detailRow.fecha_inicio || detailRow.fecha_desde || detailRow.inicio || '-'}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 180 }}>
                    <Typography variant="caption" color="text.secondary">Hasta</Typography>
                    <Typography>{detailRow.fecha_fin || detailRow.fecha_hasta || detailRow.fin || '-'}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 140, justifyContent: 'space-between', display: 'flex', }}>
                    <Typography variant="caption" color="text.secondary">Estatus</Typography>
                    <Chip label={getStatusLabel(detailRow.estatus ?? detailRow.status)} size="small" color={getStatusColor(detailRow.estatus ?? detailRow.status)} variant="outlined" />
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: 'grey.50' }} elevation={0}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>Motivo / Descripción</Typography>
                <Typography variant="body1" sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'divider', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {detailRow.motivo || detailRow.descripcion || detailRow.detalle || 'Sin motivo especificado'}
                </Typography>
              </Paper>
            </Box>
          ) : <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}><CircularProgress /></Box>}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={handleCloseDetail} sx={{color: colors.accent.dark, p:2, mr:2, '&:hover': { backgroundColor: colors.background.paper }}}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* confirm dialog */}
      <Dialog open={confirmOpen} onClose={closeConfirm} fullWidth maxWidth="sm">
        <DialogTitle>{confirmAction?.type === 'aprobar' ? 'Aprobar solicitud' : 'Rechazar solicitud'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Comentario (opcional)" multiline rows={3} value={comment} onChange={(e) => setComment(e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancelar</Button>
          <Button variant="contained" color={confirmAction?.type === 'aprobar' ? 'success' : 'error'} onClick={handleConfirm} disabled={actionLoading}>{actionLoading ? 'Procesando...' : (confirmAction?.type === 'aprobar' ? 'Aprobar' : 'Rechazar')}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Vacaciones;
