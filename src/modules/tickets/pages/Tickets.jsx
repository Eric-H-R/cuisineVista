import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem, Button, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import TicketService from '../services/TicketService';
import colors from '../../../theme/colores';
import FilterList from '@mui/icons-material/FilterList';
import { Alert } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import TagIcon from '@mui/icons-material/Tag';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';
import ImageIcon from '@mui/icons-material/Image';
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
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Tickets</Typography>
          <Typography variant="subtitle2" color="text.secondary">Consulta y gestiona tus tickets</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<RefreshIcon />} onClick={loadTickets} sx={{color: colors.primary.dark}}>Recargar</Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
  <Grid container spacing={2} alignItems="center">
    {/* Título con menos ancho */}
    <Grid size={{ xs: 12, sm: 'auto' }}>
      <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
        <FilterList sx={{ verticalAlign: 'middle', mr: 2 }} />
        Filtrar por estatus:
      </Typography>
    </Grid>
    
    {/* Filtro */}
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="status-label">Estatus</InputLabel>
        <Select 
          labelId="status-label" 
          value={statusFilter} 
          label="Estatus" 
          onChange={handleFilterChange}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value={1}>Registrada</MenuItem>
          <MenuItem value={2}>En proceso</MenuItem>
          <MenuItem value={3}>Completada</MenuItem>
          <MenuItem value={4}>Cancelada</MenuItem>
        </Select> 
      </FormControl>
     
    </Grid><Alert severity="info" fontSize="small">Puedes  ver tickets según su estatus.</Alert>
  </Grid>
</Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <LoadingComponent />
        </Box>
      ) : (
        <Grid container spacing={2}>
  {tickets.map(t => (
    <Grid size={{ xs: 12 }} key={t.id_ticket || t.id || `${t.usuario_id}-${t.created_at}`}>
      <Card sx={{ display: 'flex' }}>
        <Box sx={{ width: 260 }}>
          {renderImage(t)}
        </Box>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ticket #{t.id_ticket || t.id}</Typography>
            <Typography variant="body2" color="text.secondary">Creado: {t.created_at}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>Información: {t.notas}</Typography>
          </Box>
          
          {/* Contenedor de botones que ocupa todo el ancho */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mt: 3,
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Botón Detalle */}
            <Button 
              variant="outlined" 
              onClick={() => openDetail(t)} 
              startIcon={<VisibilityIcon />}
              sx={{ flex: 1,  color: colors.accent.main, borderColor: colors.accent.main, '&:hover': { backgroundColor: colors.accent.main, color: 'white' }   }}
            >
              Detalle
            </Button>
            
            {/* Select de estatus */}
            <FormControl size="small" sx={{ flex: 2 }}>
              <Select
                value={pendingStatuses[t.id_ticket || t.id] ?? (t.estatus || t.status || 1)}
                onChange={(e) => setPendingStatuses(prev => ({ ...prev, [t.id_ticket || t.id]: e.target.value }))}
                fullWidth
              >
                <MenuItem value={1}>Registrada</MenuItem>
                <MenuItem value={2}>En proceso</MenuItem>
                <MenuItem value={3}>Completada</MenuItem>
                <MenuItem value={4}>Cancelada</MenuItem>
              </Select>
            </FormControl>
            
            {/* Botón Actualizar */}
            <Button
              variant="contained"
              disabled={updating || ((pendingStatuses[t.id_ticket || t.id] ?? (t.estatus || t.status || 1)) === (t.estatus || t.status || 1))}
              onClick={() => handleUpdateStatus(t.id_ticket || t.id, pendingStatuses[t.id_ticket || t.id] ?? (t.estatus || t.status || 1))}
              sx={{ flex: 1, bgcolor: colors.primary.main, color: 'white', '&:hover': { backgroundColor: colors.primary.dark } }}
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

      <Dialog 
  open={detailOpen} 
  onClose={closeDetail} 
  fullWidth 
  maxWidth="sm"
  PaperProps={{
    sx: { 
      borderRadius: 2,
      bgcolor: 'background.paper'
    }
  }}
>
  <DialogTitle sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 2,
    pb: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
    bgcolor: colors.primary.dark,
    color: 'white'
    
  }}>
    <DescriptionIcon color="inherit" />
    <Typography variant="h6" fontWeight={500}>
      Detalle del Ticket
    </Typography>
  </DialogTitle>
  
  <DialogContent sx={{ p: 3 }}>
    {selected ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt:3 }}>
        
        
        {/* Notas */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
              <NotesIcon fontSize="medium" />
              Notas
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ 
            p: 1.5, 
            bgcolor: 'action.hover', 
            borderRadius: 1,
            whiteSpace: 'pre-wrap'
          }}>
            {selected.notas || 'Sin notas'}
          </Typography>
        </Box>
        
        {/* Imagen */}
        {selected.imagen_url && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <ImageIcon fontSize="small" />
                Imagen adjunta
              </Box>
            </Typography>
            <Box sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              bgcolor: 'grey.50'
            }}>
              <img 
                alt="ticket" 
                src={selected.imagen_url.startsWith('http') || selected.imagen_url.startsWith('data:') 
                  ? selected.imagen_url 
                  : `data:image/png;base64,${selected.imagen_url}`} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px',
                  objectFit: 'contain'
                }} 
              />
            </Box>
          </Box>
        )}
      </Box>
    ) : (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )}
  </DialogContent>
  
  <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
    <Button 
      onClick={closeDetail}
      variant="text"
      sx={{ textTransform: 'none', color: colors.accent.main, '&:hover': { backgroundColor: colors.background.paper } }}
    >
      Cerrar
    </Button>
  </DialogActions>
</Dialog>
    </Container>
  );
};

export default Tickets;
