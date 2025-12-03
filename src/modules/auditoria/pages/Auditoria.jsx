import  { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import { toast } from 'react-toastify';
import AuditoriaService from '../services/AuditoriaService';

const defaultPageSize = 10;

const Auditoria = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  // filters
  const [accion, setAccion] = useState('');
  const [entidad, setEntidad] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [origen, setOrigen] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);

  // dialogs
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  const [cleanOpen, setCleanOpen] = useState(false);
  const [cleanDays, setCleanDays] = useState(90);
  const [cleanLoading, setCleanLoading] = useState(false);

  const loadLogs = async (params = {}) => {
    setLoading(true);
    try {
      const res = await AuditoriaService.getDetalles(params);
      const data = res && res.data && (res.data.data || res.data) || [];
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando registros de auditoría', err);
      toast.error('Error cargando registros de auditoría');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load without filters
    loadLogs();
  }, []);

  const handleFilter = () => {
    const params = {};
    if (accion) params.accion = accion;
    if (entidad) params.entidad = entidad;
    if (usuarioId) params.usuario_id = usuarioId;
    if (origen) params.origen = origen;
    if (fechaDesde) params.fecha_inicio = fechaDesde;
    if (fechaHasta) params.fecha_fin = fechaHasta;
    setPage(0);
    loadLogs(params);
  };

  const handleClearFilters = () => {
    setAccion('');
    setEntidad('');
    setUsuarioId('');
    setOrigen('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(0);
    loadLogs();
  };

  const openDetails = (row) => {
    setDetailRow(row);
    setDetailOpen(true);
  };

  const closeDetails = () => {
    setDetailRow(null);
    setDetailOpen(false);
  };

  const confirmClean = () => setCleanOpen(true);
  const cancelClean = () => setCleanOpen(false);

  const doClean = async () => {
    setCleanLoading(true);
    try {
      await AuditoriaService.postLimpiarRegistros({ dias: Number(cleanDays) });
      toast.success('Registros limpiados correctamente');
      setCleanOpen(false);
      loadLogs();
    } catch (err) {
      console.error('Error limpiando registros', err);
      toast.error('Error limpiando registros');
    } finally {
      setCleanLoading(false);
    }
  };

  // pagination handlers (client-side)
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayed = logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Auditoría</Typography>
          <Typography variant="subtitle2" color="text.secondary">Registros de acciones y eventos del sistema</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 , p: 2, justifyContent: 'flex-end' }}>
          <Button startIcon={<RefreshIcon />} onClick={() => loadLogs()}>
            Recargar
          </Button>
          
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container  alignItems="center" spacing={2}>
          <Grid  size={{xs: 12, md:6, lg:3}} >
            <FormControl fullWidth size="small">
              <InputLabel id="accion-label">Acción</InputLabel>
              <Select labelId="accion-label" value={accion} label="Acción" onChange={(e) => setAccion(e.target.value)}>
                <MenuItem value="">--</MenuItem>
                <MenuItem value="CREATE">CREATE</MenuItem>
                <MenuItem value="UPDATE">UPDATE</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
                <MenuItem value="ACTIVATE">ACTIVATE</MenuItem>
                <MenuItem value="DEACTIVATE">DEACTIVATE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
<Grid  size={{xs: 12, md:6, lg:3}}>
            <FormControl fullWidth size="small">
              <InputLabel id="origen-label">Origen</InputLabel>
              <Select labelId="origen-label" value={origen} label="Origen" onChange={(e) => setOrigen(e.target.value)}>
                <MenuItem value="">--</MenuItem>
                <MenuItem value="web">web</MenuItem>
                <MenuItem value="movil">movil</MenuItem>
                <MenuItem value="api">api</MenuItem>
                <MenuItem value="system">system</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid  size={{xs: 12, md:6, lg:3}}>
            <TextField label="Entidad" size="small" fullWidth value={entidad} onChange={(e) => setEntidad(e.target.value)} placeholder="ej: usuarios" />
          </Grid>

          <Grid  size={{xs: 12, md:6, lg:3}}>
            <TextField label="Usuario ID" size="small" fullWidth value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} />
          </Grid>

          <Grid  size={{xs: 12, md:6, lg:3}}>
            <TextField label="Desde" type="date" size="small" InputLabelProps={{ shrink: true }} fullWidth value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
          </Grid>

          <Grid  size={{xs: 12, md:6, lg:3}}>
            <TextField label="Hasta" type="date" size="small" InputLabelProps={{ shrink: true }} fullWidth value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
          </Grid>

          <Grid  size={{xs: 12, md:12, lg:6}} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
    <Grid  size={{xs: 12, md:12, lg:12}} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
      <Button onClick={handleClearFilters}>Limpiar</Button>
            <Button variant="contained" onClick={handleFilter}>Filtrar</Button>
    </Grid>
            
          </Grid> 
          <Grid  size={{xs: 12, md:12, lg:12}} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
            <Button color="error" startIcon={<CleaningServicesIcon />} onClick={confirmClean}>
            Limpiar registros
          </Button>
            </Grid> 
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <LoadingComponent />
        </Box>
      ) : (
        <Paper>
           
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell>Entidad</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Fecha</TableCell>

              
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.map((row, idx) => (
                <TableRow key={row.id || idx}>
                  <TableCell>{row.id || row.log_id || ''}</TableCell>
                  <TableCell>{row.usuario_id || row.user_id || row.usuario || ''}</TableCell>
                  <TableCell>{row.accion || ''}</TableCell>
                  <TableCell>{row.entidad || ''}</TableCell>
                  <TableCell>{row.origen || ''}</TableCell>
                  <TableCell>{row.created_at || row.fecha || ''}</TableCell>
                  <TableCell style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.descripcion || row.data || ''}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
             
          </Table>

          <TablePagination
            component="div"
            count={logs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          >
            
        </TablePagination>
        </Paper>
      )}

      {/* Detail dialog */}
      <Dialog open={detailOpen} onClose={closeDetails} fullWidth maxWidth="md">
        <DialogTitle>Detalle del Log</DialogTitle>
        <DialogContent>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{detailRow ? JSON.stringify(detailRow, null, 2) : ''}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetails}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Clean dialog */}
      <Dialog open={cleanOpen} onClose={cancelClean}>
        <DialogTitle>Limpiar registros de auditoría</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField label="Eliminar registros mayores a (días)" type="number" fullWidth value={cleanDays} onChange={(e) => setCleanDays(e.target.value)} />
            <Typography variant="caption" color="text.secondary">Se eliminarán los registros más antiguos que el número de días indicado.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelClean}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={doClean} disabled={cleanLoading}>{cleanLoading ? 'Eliminando...' : 'Limpiar'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};



export default Auditoria;