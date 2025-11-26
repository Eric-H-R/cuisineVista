
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import recepcionesService from '../services/recepciones.service';
import RecepcionesList from '../components/RecepcionesList';
import FormularioRecepcion from '../components/FormularioRecepcion';
import colors from '../../../theme/colores';

const Recepcion = () => {
	const [loading, setLoading] = useState(true);
	const [recepciones, setRecepciones] = useState([]);
	const [sucursalId, setSucursalId] = useState(null);
	const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

	useEffect(() => {
		const sucursal = localStorage.getItem('sucursalId');
		if (sucursal) {
			const idNum = parseInt(sucursal, 10);
			if (!isNaN(idNum)) {
				setSucursalId(idNum);
				loadRecepciones(idNum);
			} else {
				toast.error('ID de sucursal inválido');
				setLoading(false);
			}
		} else {
			toast.error('No se encontró la sucursal en el sistema');
			setLoading(false);
		}
	}, []);

	const loadRecepciones = async (sucursal) => {
		try {
			setLoading(true);
			const { data } = await recepcionesService.getAllRecepciones(sucursal);
			if (data && data.success && Array.isArray(data.data)) {
				setRecepciones(data.data);
			} else {
				setRecepciones([]);
				toast.warning('No se encontraron recepciones');
			}
		} catch (error) {
			console.error('Error cargando recepciones:', error);
			const msg = error.response?.data?.message || 'Error cargando recepciones';
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};

	const handleRefresh = () => {
		if (sucursalId) loadRecepciones(sucursalId);
	};

	const [openForm, setOpenForm] = useState(false);

	const handleOpenForm = () => setOpenForm(true);
	const handleCloseForm = () => setOpenForm(false);

	const handleSaveRecepcion = async (payload) => {
		try {
			setLoading(true);
			await recepcionesService.createRecepcion(payload);
			toast.success('Recepción creada correctamente');
			handleCloseForm();
			if (sucursalId) loadRecepciones(sucursalId);
		} catch (error) {
			console.error('Error creando recepcion:', error);
			const msg = error.response?.data?.message || 'Error creando la recepción';
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelar = (recepcionId) => {
		setConfirmDialog({
			open: true,
			title: 'Cancelar Recepción',
			message: `¿Estás seguro de cancelar la recepción #${recepcionId}?`,
			onConfirm: () => confirmarCancelar(recepcionId)
		});
	};

	const confirmarCancelar = async (recepcionId) => {
		try {
			setLoading(true);
			// El endpoint acepta un objeto con revertir_compra
			await recepcionesService.cancelarRecepcion(recepcionId, { revertir_compra: true });
			toast.success('Recepción cancelada correctamente');
			if (sucursalId) loadRecepciones(sucursalId);
		} catch (error) {
			console.error('Error cancelando recepcion:', error);
			const msg = error.response?.data?.message || 'Error cancelando la recepción';
			toast.error(msg);
		} finally {
			setLoading(false);
			handleCloseConfirmDialog();
		}
	};

	const handleCloseConfirmDialog = () => {
		setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
	};

	return (
		<>
			<ToastContainer position="top-right" autoClose={5000} />

			<ConfirmDialog
				open={confirmDialog.open}
				title={confirmDialog.title}
				message={confirmDialog.message}
				onConfirm={confirmDialog.onConfirm}
				onClose={handleCloseConfirmDialog}
				onCancel={handleCloseConfirmDialog}
				confirmText="Sí, cancelar"
				cancelText="No"
			/>

			<Container maxWidth="xl" sx={{ mt: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
					<Box>
						<Typography variant="h4" component="h1" fontWeight="bold">
							Recepciones
						</Typography>
						<Typography variant="subtitle2" color="text.secondary">
							Gestión de recepciones por sucursal
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button variant="contained" onClick={handleOpenForm} sx={{ backgroundColor: colors.primary.main }}>
							NUEVA RECEPCIÓN
						</Button>
						<Button variant="outlined" onClick={handleRefresh}>
							Actualizar
						</Button>
					</Box>
				</Box>

				{loading ? (
					<LoadingComponent message="Cargando recepciones..." />
				) : (
					<>
						<RecepcionesList recepciones={recepciones} onCancel={handleCancelar} />
						<FormularioRecepcion
							open={openForm}
							onClose={handleCloseForm}
							onSave={handleSaveRecepcion}
							sucursalId={sucursalId}
							loading={loading}
						/>
					</>
				)}
			</Container>
		</>
	);
};

export default Recepcion;
