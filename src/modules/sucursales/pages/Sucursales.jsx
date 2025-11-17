import { useState, useEffect, useMemo  } from 'react'
import {
  Box,
  Typography,
  Container,
  Button,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
//import CardEstadisticas from '../components/CardEstadisticas'
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda'
import CardAsignacion from '../components/CardAsignacion'
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import FormularioSucursales from '../components/FormularioSucursales';

//TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
//API 
import sucursalesService from '../services/sucursales.service';

const Sucursales = () => {
  const [loading, setLoading] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [sucursalToEdit, setSucursalToEdit] = useState(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [sucursalFilter, setSucursalFilter] = useState('');

   // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {

      const {data} = await sucursalesService.getAll();
      const response = data;
      console.log('Datos de sucursales cargados:', response.data);
      setSucursales(response.data);

    } catch (error) {
      console.error('Error al cargar datos de sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewBranch = (sucursal = null) => {
    setSucursalToEdit(sucursal);
    setOpenModal(true);
  };

  const handleSaveSucursal = async (sucursalData) => {
    try {
      let response;
      if (sucursalToEdit) {
        await sucursalesService.update(sucursalToEdit.id_sucursal, sucursalData);
        toast.success(`Sucursal ${sucursalToEdit.nombre} actualizada`);
      } else {
        const { data } = await sucursalesService.create(sucursalData);
        response = data;
        toast.success(`Sucursal ${response.data.nombre} creada`);
      }
      setOpenModal(false);
      loadInitialData();
    } catch (error) {
      toast.error('Error guardando sucursal');
    }
  };

    // Filtrar sucursales
  const filteredSucursales = sucursales.filter(sucursal => {
    // Filtro por término de búsqueda
    const matchesSearch = searchTerm === '' || 
      sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sucursal.telefono.includes(searchTerm);

    // Filtro por sucursal (si estás en otro contexto)
    const matchesSucursal = sucursalFilter === '' || 
      sucursal.id_sucursal.toString() === sucursalFilter.toString();

    return matchesSearch && matchesSucursal;
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSucursalFilter = (sucursalId) => {
    setSucursalFilter(sucursalId);
  };

  const handleDesactivate = async (sucursalId) => {
    try {
      await sucursalesService.delete(sucursalId);
      toast.success('Sucursal desactivada');
      loadInitialData();
    } catch (error) {
      toast.error('Error desactivando sucursal');
      console.error('Error desactivando sucursal:', error);
    }
  };

  const statsData = [
    { title: 'Sucursales Activas', value: 3 },
    { title: 'Ingresos del Día', value: '$35.400' },
    { title: 'Pedidos del Día', value: 201 },
    { title: 'Empleados Activos', value: 30 }
  ];
  
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
            Gestión de Sucursales
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra las sucursales y asignaciones de personal
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleNewBranch()}
          sx={{
            backgroundColor: '#588157',
            color: 'white',
            fontWeight: 'bold',
            px: 3,
            '&:hover': {
              backgroundColor: '#486a47'
            }
          }}
        >
          NUEVA SUCURSAL
        </Button>
      </Box>
      {/* Modal de formulario de sucursal */}
      <FormularioSucursales
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveSucursal}
        sucursalToEdit={sucursalToEdit}
        loading={loading}
      />

      {/* Cards de estadísticas */}
      <CardEstadisticas cardsData={statsData} />

      {/* Barra de búsqueda con filtro */}
      <BarraBusqueda 
        placeholder="Buscar sucursales por nombre, dirección o teléfono..."
        onSearch={handleSearch}
        onSucursalChange={handleSucursalFilter}
        value={searchTerm}
        sucursalValue={sucursalFilter}
        sucursales={sucursales}
      />

      {/* Grid de Sucursales */}
      {loading ? (
        <LoadingComponent message="Cargando sucursales..." />
      ) : (
        <Grid container spacing={3}>
          {filteredSucursales.map((branch) => {  
            return (
              <Grid size={{ xs: 12, lg: 6 }} key={branch.id_sucursal}>
                <CardAsignacion 
                branch={branch}
                onEdit={handleNewBranch}
                onDesactivate={handleDesactivate}
              />
          </Grid>
        );
      })}
      </Grid>
      )}

      {/* Mensaje cuando no hay resultados */}
      {!loading && filteredSucursales.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron sucursales
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {sucursales.length === 0 
              ? 'No hay sucursales registradas. Crea la primera sucursal.' 
              : 'Intenta con otros términos de búsqueda o filtros.'
            }
          </Typography>
        </Box>
      )}
    </Container>
    </>
  );
}

export default Sucursales;