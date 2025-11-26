import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import FormularioInsumos from '../components/FormularioInsumo';
import CardInsumo from '../components/CardInsumo';
import CardInsumoStockBajo from '../components/CardInsumoStockBajo';
import LotesProximosVencer from '../components/LotesProximosVencer';

// TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API 
import insumosService from '../services/insumos.service';
import colors from '../../../theme/colores';

const Insumos = () => {
  const [loading, setLoading] = useState(true);
  const [insumos, setInsumos] = useState([]);
  const [insumosStockBajo, setInsumosStockBajo] = useState([]);
  const [insumosExistencias, setInsumosExistencias] = useState([]);
  const [lotesProximos, setLotesProximos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [insumoToEdit, setInsumoToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sucursalId, setSucursalId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Obtener sucursal_id del localStorage al cargar
  useEffect(() => {
    const sucursal = localStorage.getItem('sucursalId');
    
    if (sucursal) {
      const sucursalIdNum = parseInt(sucursal, 10);
      
      if (!isNaN(sucursalIdNum)) {
        setSucursalId(sucursalIdNum);
        loadInitialData(sucursalIdNum);
      } else {
        console.error('sucursalId no es un número válido:', sucursal);
        toast.error('ID de sucursal inválido');
        setLoading(false);
      }
    } else {
      console.error('No se encontró sucursalId en localStorage');
      toast.error('No se encontró la sucursal en el sistema');
      setLoading(false);
    }
  }, []);

  const loadInitialData = async (sucursalId) => {
    try {
      setLoading(true);
      
      // Cargar insumos activos
      const { data: insumosData } = await insumosService.getAll();
      
      // Cargar insumos con stock bajo (pasar sucursalId)
      const { data: stockBajoData } = await insumosService.getStockBajo(sucursalId);
      
      // Cargar insumos con existencias (pasar sucursalId)
      const { data: existenciasData } = await insumosService.getExistencias(sucursalId);

      const { data: lotesData } = await insumosService.getLotesProximosVencer(sucursalId, 30);

      if (insumosData && insumosData.success) {
        setInsumos(insumosData.data || []);
      }

      if (stockBajoData && stockBajoData.success) {
        setInsumosStockBajo(stockBajoData.data || []);
      }

      if (existenciasData && existenciasData.success) {
        setInsumosExistencias(existenciasData.data || []);
      }

      if (lotesData && lotesData.success) {
        setLotesProximos(lotesData.data || []);
      }
      
    } catch (error) {
      console.error('Error al cargar datos de insumos:', error);
      toast.error('Error cargando los insumos');
    } finally {
      setLoading(false);
    }
  };

  const handleNewInsumo = (insumo = null) => {
    setInsumoToEdit(insumo);
    setOpenModal(true);
  };

  const handleSaveInsumo = async (insumoData) => {
    try {
      setLoading(true);
      if (insumoToEdit) {
        // MODO EDICIÓN
        let payload = {
          "minimo_stock": insumoData.minimo_stock,
          "nombre": insumoData.nombre
        }
        await insumosService.update(insumoToEdit.id_insumo || insumoToEdit.id, payload);
        toast.success(`Insumo "${insumoData.nombre}" actualizado correctamente`);
      } else {
        // CREACIÓN
        await insumosService.create(insumoData);
        toast.success(`Insumo "${insumoData.nombre}" creado correctamente`);
      }
      
      setOpenModal(false);
      setInsumoToEdit(null);
      loadInitialData(sucursalId);
    } catch (error) {
      console.error('Error guardando insumo:', error);
      const errorMessage = error.response?.data?.message || 'Error guardando el insumo';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar insumos según la pestaña activa
  const filteredInsumos = useMemo(() => {
    let dataToFilter = [];
    
    switch (activeTab) {
      case 0: // Todos los insumos
        dataToFilter = insumos;
        break;
      case 1: // Stock bajo
        dataToFilter = insumosStockBajo;
        break;
      case 2: // Con existencias
        dataToFilter = insumosExistencias;
        break;
      case 3: // Lotes próximos a vencer
        return []
      default:
        dataToFilter = insumos;
    }

    return dataToFilter.filter(insumo => {
      return searchTerm === '' || 
        insumo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (insumo.unidad_clave && insumo.unidad_clave.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [insumos, insumosStockBajo, insumosExistencias, searchTerm, activeTab]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Calcular estadísticas
  const statsData = [
    { 
      title: 'Total de Insumos', 
      value: insumos.length,
      icon: 'inventory',
      color: colors.primary.main
    },
    { 
      title: 'Stock Bajo', 
      value: insumosStockBajo.length,
      icon: 'warning',
      color: colors.status.warning
    },
    { 
      title: 'Con Existencias', 
      value: insumosExistencias.length,
      icon: 'check_circle',
      color: colors.status.success
    },
    { 
      title: 'Insumos Filtrados', 
      value: filteredInsumos.length,
      icon: 'filter_list',
      color: colors.secondary.main
    }
  ];

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 0:
        return insumos.length === 0 
          ? 'No hay insumos registrados. Crea el primer insumo.' 
          : 'Intenta con otros términos de búsqueda.';
      case 1:
        return 'No hay insumos con stock bajo en este momento.';
      case 2:
        return 'No hay insumos con existencias registradas.';
      case 3:
        return 'No hay lotes próximos a vencer en este momento.';
      default:
        return 'No se encontraron insumos.';
    }
  };

  const getEmptyStateIcon = () => {
    switch (activeTab) {
      case 1:
        return <WarningIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />;
      case 3:
        return <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />;
      default:
        return <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />;
    }
  };

   return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Container maxWidth="xl" sx={{ mt: 0 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Insumos
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra los insumos, control de inventario y fechas de caducidad
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleNewInsumo()}
            disabled={!sucursalId}
            sx={{
              backgroundColor: colors.primary.main,
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                backgroundColor: colors.primary.dark
              }
            }}
          >
            NUEVO INSUMO
          </Button>
        </Box>

        {!sucursalId && !loading && (
          <Box sx={{ textAlign: 'center', py: 4, backgroundColor: 'warning.light', borderRadius: 2 }}>
            <Typography variant="h6" color="warning.dark">
              No se ha configurado la sucursal
            </Typography>
            <Typography variant="body2" color="warning.dark">
              Por favor, selecciona una sucursal primero
            </Typography>
          </Box>
        )}

        {sucursalId && (
          <>
            <FormularioInsumos
              open={openModal}
              onClose={() => {
                setOpenModal(false);
                setInsumoToEdit(null);
              }}
              onSave={handleSaveInsumo}
              insumoToEdit={insumoToEdit}
              loading={loading}
            />

            <CardEstadisticas cardsData={statsData} />

            {/* Pestañas ACTUALIZADAS */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor={colors.primary.dark}
                indicatorColor={colors.primary.dark}
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    color: colors.text.secondary,
                  },
                  '& .Mui-selected': {
                    color: colors.primary.dark + ' !important',
                  },
                  '& .MuiTabs-indicator': {
                    height: 4,
                    borderRadius: 2,
                  }
                }}
              >
                <Tab label={`Todos los Insumos (${insumos.length})`} />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon sx={{ color: colors.status.warning, fontSize: 18 }} />
                      Stock Bajo ({insumosStockBajo.length})
                    </Box>
                  } 
                />
                <Tab label={`Con Existencias (${insumosExistencias.length})`} />
                {/* NUEVA PESTAÑA */}
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon sx={{ color: colors.status.error, fontSize: 18 }} />
                      Lotes por Vencer ({lotesProximos.length})
                    </Box>
                  } 
                />
              </Tabs>
            </Box>

            {/* Barra de búsqueda (no mostrar en pestaña de lotes) */}
            {activeTab !== 3 && (
              <BarraBusqueda 
                placeholder={
                  activeTab === 0 ? "Buscar insumos por nombre o unidad..." :
                  activeTab === 1 ? "Buscar insumos con stock bajo..." :
                  "Buscar insumos con existencias..."
                }
                onSearch={handleSearch}
                value={searchTerm}
              />
            )}

            {loading ? (
              <LoadingComponent message={
                activeTab === 3 ? "Cargando lotes próximos a vencer..." : "Cargando insumos..."
              } />
            ) : (
              <>
                {/* MOSTRAR INSUMOS (Pestañas 0-2) */}
                {activeTab !== 3 && (
                  <Grid container spacing={3}>
                    {filteredInsumos.map((insumo) => (  
                      <Grid size={{ xs:12, md:6, lg:4 }} key={insumo.id_insumo || insumo.id}>
                        {activeTab === 1 ? (
                          <CardInsumoStockBajo 
                            insumo={insumo}
                            onEdit={() => handleNewInsumo(insumo)}
                          />
                        ) : (
                          <CardInsumo 
                            insumo={insumo}
                            onEdit={() => handleNewInsumo(insumo)}
                            showExistencias={activeTab === 2}
                          />
                        )}
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* MOSTRAR LOTES PRÓXIMOS A VENCER (Pestaña 3) */}
                {activeTab === 3 && (
                  <LotesProximosVencer />
                )}
              </>
            )}

            {/* Estados vacíos */}
            {!loading && (
              <>
                {/* Estado vacío para pestañas de insumos (0-2) */}
                {activeTab !== 3 && filteredInsumos.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    {getEmptyStateIcon()}
                    <Typography variant="h6" color="text.secondary">
                      No se encontraron insumos
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {getEmptyStateMessage()}
                    </Typography>
                    {activeTab === 0 && insumos.length === 0 && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleNewInsumo()}
                        sx={{
                          bgcolor: colors.primary.main,
                          px: 4,
                          py: 1.5,
                          mt: 2
                        }}
                      >
                        Crear Primer Insumo
                      </Button>
                    )}
                  </Box>
                )}

                {/* Estado vacío para pestaña de lotes (3) - manejado por el componente LotesProximosVencer */}
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Insumos;