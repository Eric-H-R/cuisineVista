import { useEffect, useState } from "react";
import { 
  Box, 
  Container, 
  Stack, 
  Typography, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Card,
  Divider,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CardOption from "../components/CardOption";
import { toast } from 'react-toastify';
import CuentaService from '../services/CuentaService';
import colores from '../../../theme/colores';

const Cuenta = () => {
    function stringToColor(string) {
        let hash = 0;
        let i;
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: colores.primary.main,
                width: 120,
                height: 120,
                fontSize: '2.5rem',
                fontWeight: 'bold',
                boxShadow: `0 18px 54px ${(colores.primary.main, '30')}`,
                
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1]?.[0] || ''}`,
        };
    }

    const [user, setUser] = useState(null);

    // edit 
    const [openEdit, setOpenEdit] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editValues, setEditValues] = useState({ nombre: '', apellido: '', email: '' });

    // change 
    const [openPassword, setOpenPassword] = useState(false);
    const [pwValues, setPwValues] = useState({ current_password: '', new_password: '' });
    const [pwLoading, setPwLoading] = useState(false);

    // info dialog
    const [openInfo, setOpenInfo] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await CuentaService.getPerfil();
                const data = res && res.data && res.data.user ? res.data.user : (res && res.data) || null;
                setUser(data);
            } catch (err) {
                console.error('Error cargando perfil', err);
                toast.error('Error cargando perfil');
            }
        };
        loadProfile();
    }, []);

    const handleOpenEdit = () => {
        setEditValues({ 
            nombre: user?.nombre || '', 
            apellido: user?.apellido || '', 
            email: user?.email || '' 
        });
        setOpenEdit(true);
    };

    const handleSaveEdit = async () => {
        if (!user) return;
        setEditLoading(true);
        try {
            const payload = { 
                nombre: editValues.nombre, 
                apellido: editValues.apellido, 
                email: editValues.email 
            };
            await CuentaService.updateProfile(user.id_usuario, payload);
            toast.success('Perfil actualizado correctamente');
            setUser(prev => ({ ...prev, ...payload }));
            setOpenEdit(false);
        } catch (err) {
            console.error('Error actualizando perfil', err);
            toast.error('Error al actualizar el perfil');
        } finally {
            setEditLoading(false);
        }
    };

    const handleOpenPassword = () => setOpenPassword(true);
    
    const handleChangePassword = async () => {
        setPwLoading(true);
        try {
            await CuentaService.changePassword(pwValues);
            toast.success('Contraseña actualizada correctamente');
            setOpenPassword(false);
            setPwValues({ current_password: '', new_password: '' });
        } catch (err) {
            console.error('Error cambiando contraseña', err);
            toast.error('Error al cambiar la contraseña');
        } finally {
            setPwLoading(false);
        }
    };

    const handleOpenInfo = () => setOpenInfo(true);

    return (
        <Container  sx={{ mt: 4, mb: 4 }}>
            {/* Header del perfil */}
            <Card 
                elevation={0}
                sx={{
                    
                    borderRadius: 4,
                    p: 4,
                    mb: 4,
                   
                    textAlign: 'center'
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <Avatar 
                        {...stringAvatar(user?.nombre ? `${user.nombre} ${user.apellido || ''}` : 'Usuario Anonimo')} 
                    />
                    <Box>
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            fontWeight="600" 
                            gutterBottom
                            sx={{ color: colores.text.primary }}
                        >
                            {user?.nombre || 'Usuario'} {user?.apellido || ''}
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: colores.accent.main,
                                fontWeight: '500',
                                backgroundColor: (colores.primary.main, '30'),
                                px: 2,
                                py: 1,
                                borderRadius: 6,
                                display: 'inline-block'
                            }}
                        >
                            {user?.roles && user.roles.length ? user.roles.map(r => r.nombre).join(', ') : 'Sin roles asignados'}
                        </Typography>
                    </Box>
                </Box>
            </Card>

            {/* Cards de opciones */}
            <CardOption 
                onEditProfile={handleOpenEdit} 
                onChangePassword={handleOpenPassword} 
                onViewInfo={handleOpenInfo} 
                user={user} 
            />

            {/* Modal Editar Perfil */}
            <Dialog 
                open={openEdit} 
                onClose={() => setOpenEdit(false)} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: `1px solid ${colores.primary.dark}`
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        backgroundColor: colores.primary.dark,
                        borderBottom: `1px solid ${colores.border.light}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight="600" sx={{ color: 'white'}}>
                        Editar Perfil
                    </Typography>
                    <IconButton 
                        onClick={() => setOpenEdit(false)}
                        sx={{ color: 'white'}}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, backgroundColor: colores.background.light }}>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField 
                            label="Nombre"
                            variant="outlined"
                            value={editValues.nombre}
                            onChange={(e) => setEditValues(prev => ({ ...prev, nombre: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <TextField 
                            label="Apellido"
                            variant="outlined"
                            value={editValues.apellido}
                            onChange={(e) => setEditValues(prev => ({ ...prev, apellido: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <TextField 
                            label="Email"
                            variant="outlined"
                            value={editValues.email}
                            onChange={(e) => setEditValues(prev => ({ ...prev, email: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, backgroundColor: colores.background.light, borderTop: `1px solid ${colores.border.light}` }}>
                    <Button 
                        onClick={() => setOpenEdit(false)}
                        sx={{ 
                            color: colores.text.secondary,
                            borderRadius: 2,
                            px: 3, 
                            '&:hover': {
                                backgroundColor: colores.background.paper
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSaveEdit} 
                        disabled={editLoading}
                        sx={{ 
                            backgroundColor: colores.primary.main,
                            borderRadius: 2,
                            px: 3,
                            '&:hover': {
                                backgroundColor: colores.primary.dark
                            }
                        }}
                    >
                        {editLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Cambiar Contraseña */}
            <Dialog 
                open={openPassword} 
                onClose={() => setOpenPassword(false)} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: `2px solid ${colores.primary.dark}`
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        backgroundColor: colores.primary.dark,
                        borderBottom: `1px solid ${colores.border.light}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight="600" sx={{ color: 'white' }}>
                        Cambiar Contraseña
                    </Typography>
                    <IconButton 
                        onClick={() => setOpenPassword(false)}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, backgroundColor: colores.background.light }}>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField 
                            label="Contraseña actual"
                            type="password"
                            variant="outlined"
                            value={pwValues.current_password}
                            onChange={(e) => setPwValues(prev => ({ ...prev, current_password: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <TextField 
                            label="Nueva contraseña"
                            type="password"
                            variant="outlined"
                            value={pwValues.new_password}
                            onChange={(e) => setPwValues(prev => ({ ...prev, new_password: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, backgroundColor: colores.background.light, borderTop: `1px solid ${colores.border.light}` }}>
                    <Button 
                        onClick={() => setOpenPassword(false)}
                        sx={{ 
                            color: colores.text.secondary,
                            borderRadius: 2,
                            px: 3,
                             '&:hover': {
                                backgroundColor: colores.background.paper
                        }}}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleChangePassword} 
                        disabled={pwLoading}
                        sx={{ 
                            backgroundColor: colores.primary.main,
                            borderRadius: 2,
                            px: 3,
                            '&:hover': {
                                backgroundColor: colores.primary.dark
                            }
                        }}
                    >
                        {pwLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Información del Usuario */}
            <Dialog 
                open={openInfo} 
                onClose={() => setOpenInfo(false)} 
                fullWidth 
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: `2px solid ${colores.primary.dark}`
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        backgroundColor: colores.primary.dark,
                        borderBottom: `1px solid ${colores.border.light}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight="600" sx={{ color: 'white' }}>
                        Información del Usuario
                    </Typography>
                    <IconButton 
                        onClick={() => setOpenInfo(false)}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, backgroundColor: colores.background.light }}>
                    <Card elevation={0}  
                    >
                        <Box sx={{ mt: 3, mb: 1, p:3 }}>
    <Stack spacing={2}>
        {user?.nombre && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: colores.text.primary, fontWeight: 500, minWidth: 120 }}>
                    Usuario:
                </Typography>
                <Typography variant="body1" sx={{ color: colores.text.secondary }}>
                    {user?.nombre} {user?.apellido || ''}
                </Typography>
            </Box>
        )}
        {user?.email && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: colores.text.primary, fontWeight: 500, minWidth: 120 }}>
                    Email:
                </Typography>
                <Typography variant="body1" sx={{ color: colores.text.secondary }}>
                    {user?.email}
                </Typography>
            </Box>
        )}
        {user?.roles && user.roles.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: colores.text.primary, fontWeight: 500, minWidth: 120 }}>
                    Roles:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {user.roles.map((rol, index) => (
                        <Box
                            key={index}
                            sx={{
                                backgroundColor: colores.accent.light,
                                color: 'white',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 500
                            }}
                        >
                            {rol.nombre}
                        </Box>
                    ))}
                </Box>
            </Box>
        )}
        {user?.telefono && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: colores.text.primary, fontWeight: 500, minWidth: 120 }}>
                    Teléfono:
                </Typography>
                <Typography variant="body1" sx={{ color: colores.text.secondary }}>
                    {user?.telefono}
                </Typography>
            </Box>
        )}
        {user?.created_at && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: colores.text.primary, fontWeight: 500, minWidth: 120 }}>
                    Miembro desde:
                </Typography>
                <Typography variant="body1" sx={{ color: colores.text.secondary }}>
                    {new Date(user.created_at).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </Typography>
            </Box>
        )}
    </Stack>
</Box>
                    </Card>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, backgroundColor: colores.background.light, borderTop: `1px solid ${colores.border.light}` }}>
                    <Button 
                        onClick={() => setOpenInfo(false)}
                        sx={{ 
                            color: colores.text.secondary,
                            borderRadius: 2,
                            px: 3, '&:hover': {
                                backgroundColor: colores.background.paper
                            }
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Cuenta;