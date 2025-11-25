import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem, Button, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import TicketService from '../services/TicketService';

const Tickets = () => {
  const { user } = useAuth();
  const userId = user?.id_usuario || user?.id || null;

  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [pendingStatuses, setPendingStatuses] = useState({});

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await TicketService.getTicket(userId, statusFilter || undefined);
      const data = res && res.data && (res.data.data || res.data) || [];
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando tickets', err);
      toast.error('Error cargando tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleFilterChange = async (e) => {
    setStatusFilter(e.target.value);
    try {
      setLoading(true);
      const res = await TicketService.getTicket(userId, e.target.value || undefined);
      const data = res && res.data && (res.data.data || res.data) || [];
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error filtrando tickets', err);
      toast.error('Error filtrando tickets');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (ticket) => {
    setSelected(ticket);
    setDetailOpen(true);
  };
  const closeDetail = () => {
    setSelected(null);
    setDetailOpen(false);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    // log what we're going to send
    console.log(`Updating ticket ${id} ->`, { estatus: newStatus });
    setUpdating(true);
    try {
      const res = await TicketService.updateStatus(id, newStatus);
      console.log('updateStatus response:', res);
      toast.success('Estatus actualizado');
      // refresh
      await loadTickets();
      setPendingStatuses(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error('Error actualizando estatus', err);
      toast.error('Error actualizando estatus');
    } finally {
      setUpdating(false);
    }
  };

  const renderImage = (item) => {
    const img = item.imagen_url || item.imagen || null;
    if (!img) return null;
    if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:'))) {
      return <CardMedia component="img" height="180" image={img} alt="ticket" />;
    }
    if (typeof img === 'string') {
      return <CardMedia component="img" height="180" image={`data:image/png;base64,${img}`} alt="ticket" />;
    }
    return null;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Tickets</Typography>
          <Typography variant="subtitle2" color="text.secondary">Consulta y gestiona tus tickets</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<RefreshIcon />} onClick={loadTickets}>Recargar</Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">Estatus</InputLabel>
              <Select labelId="status-label" value={statusFilter} label="Estatus" onChange={handleFilterChange}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={1}>Registrada</MenuItem>
                <MenuItem value={2}>En proceso</MenuItem>
                <MenuItem value={3}>Completada</MenuItem>
                <MenuItem value={4}>Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <LoadingComponent />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {tickets.map(t => (
            <Grid item xs={12} md={6} key={t.id_ticket || t.id || `${t.usuario_id}-${t.created_at}`}>
              <Card sx={{ display: 'flex' }}>
                <Box sx={{ width: 260 }}>
                  {renderImage(t)}
                </Box>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Ticket #{t.id_ticket || t.id}</Typography>
                  <Typography variant="body2" color="text.secondary">Creado: {t.created_at}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{t.notas}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
                    <Button variant="outlined" onClick={() => openDetail(t)} startIcon={<VisibilityIcon />}>Detalle</Button>
                    <FormControl size="small">
                      <Select
                        value={pendingStatuses[t.id_ticket || t.id] ?? (t.estatus || t.status || 1)}
                        onChange={(e) => setPendingStatuses(prev => ({ ...prev, [t.id_ticket || t.id]: e.target.value }))}
                      >
                        <MenuItem value={1}>Registrada</MenuItem>
                        <MenuItem value={2}>En proceso</MenuItem>
                        <MenuItem value={3}>Completada</MenuItem>
                        <MenuItem value={4}>Cancelada</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      disabled={updating || ((pendingStatuses[t.id_ticket || t.id] ?? (t.estatus || t.status || 1)) === (t.estatus || t.status || 1))}
                      onClick={() => handleUpdateStatus(t.id_ticket || t.id, pendingStatuses[t.id_ticket || t.id] ?? (t.estatus || t.status || 1))}
                    >
                      {updating ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={detailOpen} onClose={closeDetail} fullWidth maxWidth="md">
        <DialogTitle>Detalle del ticket</DialogTitle>
        <DialogContent>
          {selected ? (
            <Box>
              <Typography variant="subtitle2">ID: {selected.id_ticket || selected.id}</Typography>
              <Typography variant="body2">Usuario: {selected.usuario_id}</Typography>
              <Typography variant="body2">Estatus: {selected.estatus}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Notas: {selected.notas}</Typography>
              {selected.imagen_url && (
                <Box sx={{ mt: 2 }}>
                  <img alt="ticket" src={selected.imagen_url.startsWith('http') || selected.imagen_url.startsWith('data:') ? selected.imagen_url : `data:image/png;base64,${selected.imagen_url}`} style={{ maxWidth: '100%' }} />
                </Box>
              )}
            </Box>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetail}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tickets;
