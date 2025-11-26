import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  Dialog,
  DialogTitle,
  Avatar,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Switch,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Stack
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { AreasServices } from "../services/AreasServices";
import LoadingComponent from "../../../components/Loadings/LoadingComponent";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";

// Hook personalizado para manejar la vista
const useViewMode = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return {
    viewMode,
    handleViewModeChange
  };
};

const CardAreas = () => {
    const { sucursal } = useAuth();
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingActions, setLoadingActions] = useState({});
    
    // Usar el hook de vista
    const { viewMode, handleViewModeChange } = useViewMode();
    
    // Estados para el modal de edición
    const [editingArea, setEditingArea] = useState(null);
    const [areaEditada, setAreaEditada] = useState({
        nombre: '',
        descripcion: '',
        es_activa: true
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    // Estados para la eliminación 
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [areaToDelete, setAreaToDelete] = useState(null);

    const colors = {
        primary: '#588157',     
        secondary: '#A3B18A',    
        accent: '#57300D',       
        background: '#F8F9FA',   
        paper: '#EDE0D4',        
        text: '#333333'          
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                if (!sucursal) {
                    setAreas([]);
                    return;
                }
                const areasResponse = await AreasServices.getBySucursal(sucursal);
                setAreas((areasResponse && areasResponse.data && areasResponse.data.data) || []);
            } catch (error) {
                setAreas([]);
                toast.error("Error cargando áreas");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [sucursal]);

    // Función para abrir modal de edición
    const handleEdit = (area) => {
        setEditingArea(area);
        setAreaEditada({
            nombre: area.nombre || '',
            descripcion: area.descripcion || '',
            es_activa: area.es_activa !== undefined ? area.es_activa : true
        });
        setEditError('');
    };

    // Función para cerrar modal de edición
    const handleCloseEdit = () => {
        setEditingArea(null);
        setAreaEditada({ nombre: '', descripcion: '', es_activa: true });
        setEditError('');
        setEditLoading(false);
    };

    // Función para manejar cambios en el formulario de edición
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAreaEditada(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Función para enviar el formulario de edición
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        
        if (!areaEditada.nombre.trim()) {
            setEditError('El nombre del área es requerido');
            return;
        }
        
        try {
            setEditLoading(true);
            setEditError('');
            
            const areaData = {
                nombre: areaEditada.nombre.trim(),
                descripcion: areaEditada.descripcion.trim(),
                sucursal_id: parseInt(sucursal),
                es_activa: areaEditada.es_activa
            };
            
            await AreasServices.update(editingArea.id_area, areaData);
            
            toast.success('Área actualizada correctamente');
            
            // Actualizar el estado local
            setAreas(prevAreas => 
                prevAreas.map(area => 
                    area.id_area === editingArea.id_area 
                        ? { ...area, ...areaData }
                        : area
                )
            );
            
            handleCloseEdit();
        } catch (error) {
            setEditError('Error actualizando el área');
            toast.error('Error actualizando el área');
        } finally {
            setEditLoading(false);
        }
    };

    // Función para desactivar/activar área
    const handleToggleStatus = async (areaId, currentStatus) => {
        setLoadingActions(prev => ({ ...prev, [areaId]: true }));
        
        try {
            const newStatus = !currentStatus;
            await AreasServices.update(areaId, { es_activa: newStatus });
            
            // Actualizar el estado local
            setAreas(prevAreas => 
                prevAreas.map(area => 
                    area.id_area === areaId 
                        ? { ...area, es_activa: newStatus }
                        : area
                )
            );
            
            toast.success(`Área ${newStatus ? 'activada' : 'desactivada'} correctamente`);
        } catch (error) {
            toast.error("Error actualizando el estado del área");
        } finally {
            setLoadingActions(prev => ({ ...prev, [areaId]: false }));
        }
    };

    // Función para abrir el diálogo de confirmación
    const handleOpenDeleteDialog = (areaId) => {
        setAreaToDelete(areaId);
        setDeleteDialogOpen(true);
    };

    // Función para cerrar el diálogo de confirmación
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setAreaToDelete(null);
    };

    // Función para eliminar área
    const handleDelete = async () => {
        if (!areaToDelete) return;

        setLoadingActions(prev => ({ ...prev, [areaToDelete]: true }));
        
        try {
            await AreasServices.delete(areaToDelete);
            
            // Remover del estado local
            setAreas(prevAreas => prevAreas.filter(area => area.id_area !== areaToDelete));
            toast.success('Área eliminada correctamente');
        } catch (error) {
            console.error("Error eliminando área:", error);
            toast.error("Error eliminando el área");
        } finally {
            setLoadingActions(prev => ({ ...prev, [areaToDelete]: false }));
            handleCloseDeleteDialog();
        }
    };

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" py={4}>
                    <LoadingComponent />
                </Box>
            </Container>
        );
    }

    // Componente para la card en vista de cuadrícula
    const GridCard = ({ area }) => (
        <Card 
            elevation={0}
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                background: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 3, pb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography 
                        variant="h6" 
                        component="h2"
                        sx={{ 
                            fontWeight: '400',
                            color: 'text.primary'
                        }}
                    >
                        {area.nombre}
                    </Typography>
                    <Chip 
                        label={area.es_activa ? "Activa" : "Inactiva"} 
                        size="small"
                        variant="outlined"
                        color={area.es_activa ? "primary" : "default"}
                        sx={{ 
                            fontSize: '0.7rem',
                            height: 24
                        }}
                    />
                </Box>

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 2,
                        minHeight: '40px',
                        lineHeight: 1.4
                    }}
                >
                    {area.descripcion || "Sin descripción"}
                </Typography>
            </CardContent>

            <Box sx={{ 
                p: 2, 
                pt: 0, 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="caption" color="text.secondary">
                    ID: {area.id_area}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={area.es_activa ? "Desactivar" : "Activar"}>
                        <IconButton
                            onClick={() => handleToggleStatus(area.id_area, area.es_activa)}
                            disabled={loadingActions[area.id_area]}
                            size="small"
                            sx={{ 
                                color: area.es_activa ? 'primary.main' : 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                        >
                            {loadingActions[area.id_area] ? (
                                <CircularProgress size={20} />
                            ) : area.es_activa ? (
                                <ToggleOnIcon />
                            ) : (
                                <ToggleOffIcon />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar">
                        <IconButton
                            onClick={() => handleEdit(area)}
                            disabled={loadingActions[area.id_area]}
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                    color: 'primary.main'
                                }
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                        <IconButton
                            onClick={() => handleOpenDeleteDialog(area.id_area)}
                            disabled={loadingActions[area.id_area]}
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                    color: 'error.main'
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Card>
    );

    // Componente para el item en vista de lista
    const ListItem = ({ area }) => (
        <Card 
            elevation={0}
            sx={{ 
                display: 'flex',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'primary.light',
                borderRadius: 2,
                backgroundColor: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                },
                mb: 1
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: '400',
                                color: 'text.primary'
                            }}
                        >
                            {area.nombre}
                        </Typography>
                        <Chip 
                            label={area.es_activa ? "Activa" : "Inactiva"} 
                            size="small"
                            variant="outlined"
                            color={area.es_activa ? "primary" : "default"}
                            sx={{ 
                                fontSize: '0.7rem',
                                height: 24
                            }}
                        />
                    </Box>
                    
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            lineHeight: 1.4,
                            mb: 1
                        }}
                    >
                        {area.descripcion || "Sin descripción"}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary">
                        ID: {area.id_area}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={area.es_activa ? "Desactivar" : "Activar"}>
                        <IconButton
                            onClick={() => handleToggleStatus(area.id_area, area.es_activa)}
                            disabled={loadingActions[area.id_area]}
                            size="small"
                            sx={{ 
                                color: area.es_activa ? 'primary.main' : 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                        >
                            {loadingActions[area.id_area] ? (
                                <CircularProgress size={20} />
                            ) : area.es_activa ? (
                                <ToggleOnIcon />
                            ) : (
                                <ToggleOffIcon />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar">
                        <IconButton
                            onClick={() => handleEdit(area)}
                            disabled={loadingActions[area.id_area]}
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                    color: 'primary.main'
                                }
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                        <IconButton
                            onClick={() => handleOpenDeleteDialog(area.id_area)}
                            disabled={loadingActions[area.id_area]}
                            size="small"
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                    color: 'error.main'
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <>
            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                title="Eliminar Área"
                message="¿Estás seguro de que deseas eliminar esta área? Esta acción no se puede deshacer."
            />

            {/* Modal de Edición */}
            <Dialog 
                open={!!editingArea} 
                onClose={handleCloseEdit}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    p: 3,
                    pb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6" fontWeight="400">
                        Editar área
                    </Typography>
                    <IconButton 
                        onClick={handleCloseEdit}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Box sx={{ p: 3 }}>
                    <Box component="form" onSubmit={handleSubmitEdit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            
                            {editError && (
                                <Alert severity="error" sx={{ borderRadius: 1 }}>
                                    {editError}
                                </Alert>
                            )}

                            <TextField
                                name="nombre"
                                label="Nombre del área"
                                value={areaEditada.nombre}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                                required
                                disabled={editLoading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            
                            <TextField
                                name="descripcion"
                                label="Descripción"
                                value={areaEditada.descripcion}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                disabled={editLoading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                            }}>
                                <Box>
                                    <Typography variant="body1" fontWeight="400">
                                        Área activa
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {areaEditada.es_activa ? 'Disponible para uso' : 'No disponible'}
                                    </Typography>
                                </Box>
                                <Switch
                                    name="es_activa"
                                    checked={areaEditada.es_activa}
                                    onChange={handleInputChange}
                                    disabled={editLoading}
                                    color="primary"
                                />
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                                <Typography 
                                    variant="button" 
                                    onClick={handleCloseEdit}
                                    sx={{ 
                                        color: 'text.secondary',
                                        cursor: 'pointer',
                                        py: 1,
                                        px: 2,
                                        borderRadius: 1,
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                >
                                    Cancelar
                                </Typography>
                                
                                <Typography 
                                    variant="button" 
                                    type="submit"
                                    disabled={editLoading}
                                    sx={{ 
                                        color: 'primary.main',
                                        cursor: editLoading ? 'default' : 'pointer',
                                        py: 1,
                                        px: 2,
                                        borderRadius: 1,
                                        backgroundColor: editLoading ? 'action.disabled' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: editLoading ? 'action.disabled' : 'action.hover'
                                        }
                                    }}
                                >
                                    {editLoading ? 'Guardando...' : 'Guardar'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Dialog>

            {/* Header con controles de vista */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt:2,  p:2 }}>
                <Typography variant="h5" fontWeight="500">
                    Total de áreas Registradas
                </Typography>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="modo de vista"
                    size="small"
                >
                    <ToggleButton value="grid" aria-label="vista cuadrícula">
                        <GridViewIcon />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="vista lista">
                        <ViewListIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
           </Box>
            {/* Contenido según el modo de vista */}
            <Box mt={2} sx={{background: 'linear-gradient(to bottom, #ce8c4e10 0%, #ede0d40c 10%)', p:2, borderRadius:2, border:'1px solid', borderColor:'divider'}}>
                {areas.length === 0 ? (
                    <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ py: 8 }}>
                        No hay áreas registradas
                    </Typography>
                ) : viewMode === 'grid' ? (
                    <Grid container spacing={2}>
                        {areas.map(area => (
                            <Grid size={{xs:12, md:6, lg:4}} key={area.id_area}>
                                <GridCard area={area} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Stack spacing={1}>
                        {areas.map(area => (
                            <ListItem key={area.id_area} area={area} />
                        ))}
                    </Stack>
                )}
            </Box> 
        </>
    );
};

export default CardAreas;