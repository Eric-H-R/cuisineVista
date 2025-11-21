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

const colors = {
  primary: '#588157',     
  secondary: '#A3B18A',    
  accent: '#57300D',       
  background: '#F8F9FA',   
  paper: '#EDE0D4',        
  text: '#333333'          
};

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
          backgroundColor: colors.primary, 
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
              bgcolor: colors.secondary, 
              color: colors.primary,
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
        <Box sx={{ p: 4 }}>
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
                <Typography variant="body2" fontWeight="medium" color={colors.text}>
                  Sucursal Asignada:
                </Typography>
                <Typography variant="body2" color={colors.text} sx={{ opacity: 0.8 }}>
                  {sucursal ? `ID: ${sucursal}` : 'No hay sucursal seleccionada'}
                </Typography>
              </Box>
              
              {/* Botones */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  type="button" 
                  variant="outlined" 
                  color="inherit"
                  onClick={handleClose}
                  disabled={loading}
                  sx={{
                    color: colors.text,
                    borderColor: colors.secondary,
                    '&:hover': {
                      borderColor: colors.primary,
                      backgroundColor: `${colors.primary}10`
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
                    backgroundColor: colors.primary,
                    '&:hover': {
                      backgroundColor: colors.accent
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
          backgroundColor: colors.primary,
          color: 'white',
          '&:hover': {
            backgroundColor: colors.accent
          }
        }}
      >
        Agregar Área
      </Button>
    </>
  );
}

export default BasicModal;
