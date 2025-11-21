import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Chip,
  IconButton, 
  Dialog,
  DialogTitle,
  Avatar,
  TextField,
  Alert,
  CircularProgress
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { AreasServices } from "../services/AreasServices";
import LoadingComponent from "../../../components/Loadings/LoadingComponent";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";

const CardAreas = () => {
    const { sucursal } = useAuth();
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingActions, setLoadingActions] = useState({});
    
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

    return (
        <>

        {/* Diálogo de Confirmación para Eliminar Área */}
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
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 10px 40px rgba(88, 129, 87, 0.2)',
                        border: `1px solid ${colors.primary}20`
                    }
                }}
            >
                <DialogTitle sx={{ 
                    backgroundColor: colors.primary, 
                    color: 'white',
                    py: 2,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                            color: colors.primary,
                            width: 48,
                            height: 48
                        }}>
                            <EditIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                Editar Área
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {editingArea?.nombre}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton 
                        onClick={handleCloseEdit}
                        sx={{ color: 'white' }}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                {/* Formulario de Edición */}
                <Box sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmitEdit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            
                            {/* Alertas */}
                            {editError && (
                                <Alert severity="error">
                                    {editError}
                                </Alert>
                            )}

                            {/* Información de la área */}
                            <Box sx={{ 
                                p: 2, 
                                backgroundColor: colors.background, 
                                borderRadius: 1,
                                border: `1px solid ${colors.primary}20`
                            }}>
                                <Typography variant="body2" fontWeight="medium">
                                    Información de la Área:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ID: {editingArea?.id_area} • Sucursal: {sucursal}
                                </Typography>
                            </Box>

                            {/* Campo Nombre */}
                            <TextField
                                name="nombre"
                                label="Nombre del Área *"
                                value={areaEditada.nombre}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                                required
                                disabled={editLoading}
                                helperText="Nombre único para identificar el área"
                            />
                            
                            {/* Campo Descripción */}
                            <TextField
                                name="descripcion"
                                label="Descripción"
                                value={areaEditada.descripcion}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                disabled={editLoading}
                                helperText="Descripción detallada del área"
                            />
                            
                            {/* Checkbox Estado */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                p: 2,
                                border: `1px solid ${areaEditada.es_activa ? colors.accent : '#ccc'}30`,
                                borderRadius: 1,
                                backgroundColor: areaEditada.es_activa ? `${colors.accent}10` : 'transparent'
                            }}>
                                <input
                                    type="checkbox"
                                    name="es_activa"
                                    checked={areaEditada.es_activa}
                                    onChange={handleInputChange}
                                    disabled={editLoading}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        accentColor: colors.accent
                                    }}
                                />
                                <Box>
                                    <Typography variant="body1" fontWeight="medium">
                                        Área Activa
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {areaEditada.es_activa 
                                            ? 'El área está disponible para uso' 
                                            : 'El área no está disponible'
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                            
                            {/* Botones */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button 
                                    type="button" 
                                    variant="outlined" 
                                    color="inherit"
                                    onClick={handleCloseEdit}
                                    disabled={editLoading}
                                    sx={{
                                        color: colors.text,
                                        borderColor: colors.primary,
                                        '&:hover': {
                                            borderColor: colors.secondary,
                                            backgroundColor: `${colors.secondary}10`
                                        }
                                    }}
                                >
                                    Cancelar
                                </Button>
                                
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    disabled={editLoading}
                                    startIcon={editLoading ? <CircularProgress size={20} /> : <EditIcon />}
                                    sx={{
                                        backgroundColor: colors.accent,
                                        '&:hover': {
                                            backgroundColor: colors.primary
                                        },
                                        '&:disabled': {
                                            backgroundColor: `${colors.text}40`
                                        }
                                    }}
                                >
                                    {editLoading ? 'Guardando...' : 'Actualizar Área'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Dialog>

            {/* Grid de Cards */}
            <Box mt={4}>
                {areas.length === 0 ? (
                    <Typography variant="h6" textAlign="center" color="textSecondary">
                        No hay áreas registradas para esta sucursal
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {areas.map(area => (
                            <Grid size={{xs: 12, sm: 6, md: 4}}  key={area.id_area}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        {/* Header con nombre y estado */}
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Typography 
                                                variant="h6" 
                                                component="h2"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    color: 'primary.main'
                                                }}
                                            >
                                                {area.nombre}
                                            </Typography>
                                            <Chip 
                                                label={area.es_activa ? "Activa" : "Inactiva"} 
                                                color={area.es_activa ? "success" : "default"}
                                                size="small"
                                                variant={area.es_activa ? "filled" : "outlined"}
                                            />
                                        </Box>

                                        {/* Descripción */}
                                        <Typography 
                                            variant="body2" 
                                            color="textSecondary" 
                                            sx={{ 
                                                mb: 2,
                                                minHeight: '40px'
                                            }}
                                        >
                                            {area.descripcion || "Sin descripción"}
                                        </Typography>

                                        {/* Información adicional */}
                                        <Box sx={{ mt: 'auto' }}>
                                            <Typography variant="caption" color="textSecondary" display="block">
                                                ID: {area.id_area}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" display="block">
                                                Creado: {area.created_at ? new Date(area.created_at).toLocaleDateString() : '-'}
                                            </Typography>
                                        </Box>
                                    </CardContent>

                                    {/* Acciones */}
                                    <CardActions sx={{ 
                                        p: 2, 
                                        pt: 0, 
                                        justifyContent: 'space-between',
                                        borderTop: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <Box>
                                            {/* Botón Activar/Desactivar */}
                                            <IconButton
                                                onClick={() => handleToggleStatus(area.id_area, area.es_activa)}
                                                disabled={loadingActions[area.id_area]}
                                                color={area.es_activa ? "success" : "default"}
                                                size="small"
                                                title={area.es_activa ? "Desactivar área" : "Activar área"}
                                            >
                                                {loadingActions[area.id_area] ? (
                                                    <Box width={24} height={24} />
                                                ) : area.es_activa ? (
                                                    <ToggleOnIcon />
                                                ) : (
                                                    <ToggleOffIcon />
                                                )}
                                            </IconButton>

                                            {/* Botón Editar */}
                                            <IconButton
                                                onClick={() => handleEdit(area)}
                                                disabled={loadingActions[area.id_area]}
                                                color="primary"
                                                size="small"
                                                title="Editar área"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Box>

                                        {/* Botón Eliminar */}
                                        <Button
                                            onClick={() => handleOpenDeleteDialog(area.id_area)}
                                            disabled={loadingActions[area.id_area]}
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            variant="outlined"
                                        >
                                            Eliminar
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default CardAreas;