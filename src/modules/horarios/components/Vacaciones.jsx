import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Typography, CircularProgress, Select, MenuItem } from '@mui/material';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import VacacionesService from '../services/vacacionesService';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

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
  }, [sucursalId]);

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

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField label="Sucursal ID" size="small" value={sucursalId} onChange={(e) => setSucursalId(e.target.value)} />
        <Select size="small" value={estatus} onChange={(e) => setEstatus(e.target.value)} displayEmpty sx={{ minWidth: 180 }}>
          <MenuItem value="">Todos los estatus</MenuItem>
          <MenuItem value={"1"}>Pendiente (1)</MenuItem>
          <MenuItem value={"2"}>Aprobada (2)</MenuItem>
          <MenuItem value={"3"}>Rechazada (3)</MenuItem>
        </Select>
        <Button variant="outlined" onClick={() => sucursalId && load(sucursalId, estatus)}>Filtrar</Button>
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
                <TableCell>{s.motivo || s.descripcion || s.detalle || '-'}</TableCell>
                <TableCell>{s.estatus || s.status || '-'}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => handleOpenDetail(s)}>Ver</Button>
                  <Button size="small" sx={{ ml: 1 }} variant="contained" color="success" onClick={() => openConfirm('aprobar', s.id_solicitud || s.id)}>Aceptar</Button>
                  <Button size="small" sx={{ ml: 1 }} variant="contained" color="error" onClick={() => openConfirm('rechazar', s.id_solicitud || s.id)}>Rechazar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* detail dialog */}
      <Dialog open={detailOpen} onClose={handleCloseDetail} fullWidth maxWidth="md">
        <DialogTitle>Detalle solicitud</DialogTitle>
        <DialogContent>
          {detailRow ? (
            <Box>
              <Typography variant="subtitle2">ID: {detailRow.id_solicitud || detailRow.id}</Typography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(detailRow, null, 2)}</pre>
            </Box>
          ) : <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Cerrar</Button>
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
