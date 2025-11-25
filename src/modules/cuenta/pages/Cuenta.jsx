
import  { useEffect, useState } from "react";
import { Box, Container, Stack, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import CardOption from "../components/CardOption";
import { toast } from 'react-toastify';
import CuentaService from '../services/CuentaService';

const Cuenta = () => {

    // funcion con Avatar para poner las iniciales del usuario

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
                bgcolor: stringToColor(name),
                with: 100,
                height: 100,
                
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    const [user, setUser] = useState(null);

    // edit profile dialog
    const [openEdit, setOpenEdit] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editValues, setEditValues] = useState({ nombre: '', apellido: '', email: '' });

    // change password dialog
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
        setEditValues({ nombre: user?.nombre || '', apellido: user?.apellido || '', email: user?.email || '' });
        setOpenEdit(true);
    };

    const handleSaveEdit = async () => {
        if (!user) return;
        setEditLoading(true);
        try {
            const payload = { nombre: editValues.nombre, apellido: editValues.apellido, email: editValues.email };
            await CuentaService.updateProfile(user.id_usuario, payload);
            toast.success('Perfil actualizado');
            setUser(prev => ({ ...prev, ...payload }));
            setOpenEdit(false);
        } catch (err) {
            console.error('Error actualizando perfil', err);
            toast.error('Error actualizando perfil');
        } finally {
            setEditLoading(false);
        }
    };

    const handleOpenPassword = () => setOpenPassword(true);
    const handleChangePassword = async () => {
        setPwLoading(true);
        try {
            await CuentaService.changePassword(pwValues);
            toast.success('Contraseña actualizada');
            setOpenPassword(false);
            setPwValues({ current_password: '', new_password: '' });
        } catch (err) {
            console.error('Error cambiando contraseña', err);
            toast.error('Error cambiando contraseña');
        } finally {
            setPwLoading(false);
        }
    };

    const handleOpenInfo = () => setOpenInfo(true);

    return (
        <Container maxWidth="xl" sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 , justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar {...stringAvatar(user?.nombre ? `${user.nombre} ${user.apellido || ''}` : 'Usuario X')}  sx={{ width: 100, height: 100, bgcolor: '#603808', fontSize: 40, boxShadow: 10 }}/>
                        </Stack>
                    </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                            {user?.nombre || 'Usuario'}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {user?.roles && user.roles.length ? user.roles.map(r => r.nombre).join(', ') : 'Sin roles'}
                        </Typography>
                    </Box>
                </Box>
                <CardOption onEditProfile={handleOpenEdit} onChangePassword={handleOpenPassword} onViewInfo={handleOpenInfo} user={user} />

                {/* Edit profile dialog */}
                <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Editar información</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Nombre" value={editValues.nombre} onChange={(e) => setEditValues(prev => ({ ...prev, nombre: e.target.value }))} />
                            <TextField label="Apellido" value={editValues.apellido} onChange={(e) => setEditValues(prev => ({ ...prev, apellido: e.target.value }))} />
                            <TextField label="Email" value={editValues.email} onChange={(e) => setEditValues(prev => ({ ...prev, email: e.target.value }))} />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleSaveEdit} disabled={editLoading}>{editLoading ? 'Guardando...' : 'Guardar'}</Button>
                    </DialogActions>
                </Dialog>

                {/* Change password dialog */}
                <Dialog open={openPassword} onClose={() => setOpenPassword(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Cambiar contraseña</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Contraseña actual" type="password" value={pwValues.current_password} onChange={(e) => setPwValues(prev => ({ ...prev, current_password: e.target.value }))} />
                            <TextField label="Nueva contraseña" type="password" value={pwValues.new_password} onChange={(e) => setPwValues(prev => ({ ...prev, new_password: e.target.value }))} />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPassword(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleChangePassword} disabled={pwLoading}>{pwLoading ? 'Guardando...' : 'Cambiar'}</Button>
                    </DialogActions>
                </Dialog>

                {/* Info dialog */}
                <Dialog open={openInfo} onClose={() => setOpenInfo(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Información del usuario</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 1 }}>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>{user ? JSON.stringify(user, null, 2) : 'Cargando...'}</pre>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenInfo(false)}>Cerrar</Button>
                    </DialogActions>
                </Dialog>
        </Container>
        );
};

export default Cuenta;
