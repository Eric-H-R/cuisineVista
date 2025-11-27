import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Components
import CardCampania from '../components/CardCampania';
import ModalMetricas from '../components/ModalMetricas';
import ModalCrearCampania from '../components/ModalCrearCampania';
import colors from '../../../theme/colores';

// Services
import campaniasService from '../services/campanias.service';

const GestionCampanias = () => {
  const [campanias, setCampanias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);

  // Filtros para campañas
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [tabCampañasActual, setTabCampañasActual] = useState(0);

  useEffect(() => {
    cargarCampanias();
  }, []);

  const cargarCampanias = async () => {
    try {
      setLoading(true);
      const { data } = await campaniasService.getAll();
      setCampanias(data.campanias || []);
    } catch (error) {
      console.error('Error cargando campañas:', error);
      toast.error('Error al cargar las campañas');
    } finally {
      setLoading(false);
    }
  };

  const handleActivarCampania = async (campania) => {
    try {
      await campaniasService.activar(campania.id_campania);
      toast.success('✅ Campaña activada exitosamente');
      cargarCampanias();
    } catch (error) {
      console.error('Error activando campaña:', error);
      toast.error('❌ Error al activar la campaña');
    }
  };

  const handleDesactivarCampania = async (campania) => {
    try {
      await campaniasService.desactivar(campania.id_campania);
      toast.success('✅ Campaña desactivada exitosamente');
      cargarCampanias();
    } catch (error) {
      console.error('Error desactivando campaña:', error);
      toast.error('❌ Error al desactivar la campaña');
    }
  };

  const handleGenerarCampania = async (datosCampania) => {
  try {
    // ✅ Asegurar que cliente_ids sea un array de números
    const clienteIds = Array.isArray(datosCampania.cliente_ids) 
      ? datosCampania.cliente_ids 
      : datosCampania.clientesSeleccionados?.map(c => c.id_usuario) || [];

    const campaniaData = {
      nombre_campania: datosCampania.nombre_campania,
      codigo: datosCampania.codigo,
      porcentaje_desc: datosCampania.porcentaje_desc,
      fecha_vigencia: datosCampania.fecha_vigencia,
      cliente_ids: clienteIds
    };
    
    console.log('📤 Creando campaña:', campaniaData);
    await campaniasService.generarDesdeMetrica(campaniaData);
    toast.success('🎉 Campaña creada exitosamente');
    cargarCampanias();
  } catch (error) {
    console.error('Error generando campaña:', error);
    toast.error('❌ Error al crear la campaña');
  }
};


  // Filtrar campañas según los tabs Y el filtro de estado
  const campaniasFiltradas = campanias.filter(campania => {
    // Filtro del tab
    if (tabCampañasActual === 1 && campania.estatus !== 1) return false; // Solo activas
    if (tabCampañasActual === 2 && campania.estatus !== 0) return false; // Solo inactivas
    
    // Filtro del select
    if (filtroEstatus !== 'todos' && campania.estatus.toString() !== filtroEstatus) return false;
    
    return true;
  });

  // Para los contadores - CORREGIDOS
  const campaniasActivas = campanias.filter(c => c.estatus === 1);
  const campaniasInactivas = campanias.filter(c => c.estatus === 0); // Cambiado de 2 a 0
  console.log(campanias)
  return (
    <Container maxWidth="xl" sx={{ mt: 0, bgcolor: colors.background.default, minHeight: '100vh' }}>
      {/* Header Principal */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        bgcolor: colors.background.paper, 
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={colors.text.primary} gutterBottom>
              Gestión de Campañas
            </Typography>
            <Typography variant="subtitle1" color={colors.text.secondary}>
              Crea y gestiona campañas de cupones para tus clientes
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalCrearOpen(true)}
              sx={{
                bgcolor: colors.primary.main,
                '&:hover': {
                  bgcolor: colors.primary.dark
                }
              }}
            >
              Nueva Campaña
            </Button>
          </Box>
        </Box>

        {/* Estadísticas Rápidas */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 200, bgcolor: colors.primary.light }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color={colors.primary.contrastText}>
                {campanias.length}
              </Typography>
              <Typography variant="body2" color={colors.primary.contrastText}>
                Total Campañas
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200, bgcolor: colors.status.success }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="white">
                {campaniasActivas.length}
              </Typography>
              <Typography variant="body2" color="white">
                Activas
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200, bgcolor: colors.status.warning }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="white">
                {campaniasInactivas.length}
              </Typography>
              <Typography variant="body2" color="white">
                Inactivas
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filtros y Tabs de Campañas */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tabs 
            value={tabCampañasActual} 
            onChange={(e, nuevoValor) => setTabCampañasActual(nuevoValor)}
          >
            <Tab label="Todas las Campañas" />
            <Tab label={`Activas (${campaniasActivas.length})`} />
            <Tab label={`Inactivas (${campaniasInactivas.length})`} />
          </Tabs>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filtrar por estado</InputLabel>
            <Select
              value={filtroEstatus}
              label="Filtrar por estado"
              onChange={(e) => setFiltroEstatus(e.target.value)}
            >
              <MenuItem value="todos">Todos los estados</MenuItem>
              <MenuItem value="1">Activas</MenuItem>
              <MenuItem value="0">Inactivas</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Grid de Campañas */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="h6" color={colors.text.secondary}>
            Cargando campañas...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {campaniasFiltradas.length === 0 ? (
            <Grid item size={{xs: 12}}>
              <Card sx={{ textAlign: 'center', py: 8 }}>
                <CardContent>
                  <CampaignIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />
                  <Typography variant="h6" color={colors.text.secondary} gutterBottom>
                    No hay campañas {filtroEstatus !== 'todos' ? 'con este filtro' : 'creadas'}
                  </Typography>
                  <Typography variant="body2" color={colors.text.secondary} sx={{ mb: 3 }}>
                    {filtroEstatus === 'todos' 
                      ? 'Comienza creando tu primera campaña de cupones' 
                      : 'Intenta con otros filtros o crea una nueva campaña'
                    }
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setModalCrearOpen(true)}
                  >
                    Crear Primera Campaña
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            campaniasFiltradas.map((campania) => (
              <Grid item size={{xs: 12, sm: 6, md: 4, lg: 3}} key={campania.id_campania}>
                <CardCampania
                  campania={campania}
                  onActivar={handleActivarCampania}
                  onDesactivar={handleDesactivarCampania}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      <ModalCrearCampania
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onCrearCampania={handleGenerarCampania}
      />
    </Container>
  );
};

export default GestionCampanias;