import * as React from 'react';
import Button from '@mui/material/Button';
import { 
  Box, 
  DialogTitle, 
  Dialog, 
  Typography, 
  TextField,
  CircularProgress
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';;
import { useAuth } from '../../../context/AuthContext'; 
import AreasServices from '../services/AreasServices'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import colors from '../../../theme/colores';
import { Cancel } from '@mui/icons-material';

const BasicModal = ({ onAreaAdded }) => {
  const [open, setOpen] = React.useState(false);
  const { sucursal } = useAuth();
  
  // Estados del formulario
  const [nuevaArea, setNuevaArea] = React.useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    // Resetear estados al cerrar
    setNuevaArea({ nombre: '', descripcion: '' });
    setLoading(false);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaArea(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones usando TOAST
    if (!sucursal) {
      toast.error('Por favor selecciona una sucursal primero');
      return;
    }
    
    if (!nuevaArea.nombre.trim()) {
      toast.error('El nombre del área es requerido');
      return;
    }
    
    try {
      setLoading(true);
      
      const areaData = {
        nombre: nuevaArea.nombre.trim(),
        descripcion: nuevaArea.descripcion.trim(),
        sucursal_id: parseInt(sucursal),
        es_activa: true
      };
      
      console.log('Creando área:', areaData);
      
      const response = await AreasServices.create(areaData);
      console.log('Área creada:', response);
      
      toast.success('Área creada exitosamente');
      
      // Limpiar formulario
      setNuevaArea({ nombre: '', descripcion: '' });
      
      // Notificar al componente padre que se agregó un área
      if (onAreaAdded) {
        onAreaAdded();
      }
      
      // Cerrar automáticamente después de 2 segundos
      setTimeout(() => {
        handleClose();
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error creando área:', error);
      let errorMessage = 'Error al crear el área';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Error de conexión';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(88, 129, 87, 0.2)',
            border: `1px solid ${colors.secondary}20`
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: colors.primary.dark, 
          color: 'white',
          py: 2,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '5%',
            width: '90%',
            height: '2px',
            backgroundColor: colors.secondary
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: 'white', 
              color: colors.primary.dark,
              width: 48,
              height: 48
            }}>
              <AddIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Agregar Nueva Área
            </Typography>
          </Box>
        </DialogTitle>

        {/* Formulario */}
        <Box sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Campo Nombre */}
              <TextField
                name="nombre"
                label="Nombre del Área *"
                value={nuevaArea.nombre}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                disabled={loading}
                helperText="Ej: Terraza, Salón Principal, Bar..."
              />
              
              {/* Campo Descripción */}
              <TextField
                name="descripcion"
                label="Descripción"
                value={nuevaArea.descripcion}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                disabled={loading}
                helperText="Descripción opcional del área"
              />
              
              {/* Información de Sucursal */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: colors.background, 
                borderRadius: 1,
                border: `1px solid ${colors.secondary}30`
              }}>
              </Box>
              
              {/* Botones */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                <Button
                startIcon={<Cancel />} 
                  type="button" 
                  variant="text" 
                  color="inherit"
                  onClick={handleClose}
                  disabled={loading}
                  sx={{
                    color: colors.accent.main,
                    '&:hover': {
                      borderColor: colors.primary.main,
                      backgroundColor: colors.background.paper
                    }
                  }}
                >
                  Cancelar
                </Button>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !sucursal}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{
                    backgroundColor: colors.primary.main,
                    '&:hover': {
                      backgroundColor: colors.primary.dark
                    },
                    '&:disabled': {
                      backgroundColor: `${colors.text}40`
                    }
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar Área'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
   
      <Button 
        onClick={handleOpen}
        variant="contained"
        size="large"
        startIcon={<AddIcon/>}
        sx={{
          backgroundColor: colors.primary.dark,
          color: 'white',
          '&:hover': {
            backgroundColor: colors.primary.dark,
            boxShadow: '0 4px 20px rgba(72, 106, 71, 0.4)'
          }
        }}
      >
        Agregar Área
      </Button>
    </>
  );
}

export default BasicModal;
