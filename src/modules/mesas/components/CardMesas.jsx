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
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Tooltip,
  Divider,
  Table,
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AreasServices from "../../areas/services/AreasServices";
import MesasService from "../services/MesasService";
import LoadingComponent from "../../../components/Loadings/LoadingComponent";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CloseIcon from "@mui/icons-material/Close";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";
import colors from "../../../theme/colores";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TableBarIcon from "@mui/icons-material/TableBar";

// Hook personalizado para manejar la vista
const useViewMode = () => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' o 'list'

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return {
    viewMode,
    handleViewModeChange,
  };
};

const CardMesas = () => {
  const { sucursal } = useAuth();
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState({});

  // Usar el hook de vista
  const { viewMode, handleViewModeChange } = useViewMode();

  // Estados para edición
  const [editingMesa, setEditingMesa] = useState(null);
  const [mesaEditada, setMesaEditada] = useState({
    nombre: "",
    capacidad: "",
    descripcion: "",
    es_activa: true,
  });
  const [editError, setEditError] = useState("");

  // Estados para eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mesaToDelete, setMesaToDelete] = useState(null);

  // Estados para áreas y filtros
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [soloActivas, setSoloActivas] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (!sucursal) {
          setMesas([]);
          return;
        }

        // Cargar áreas para el filtro
        try {
          const areasRes = await AreasServices.getBySucursal(sucursal);
          const areasData =
            (areasRes &&
              areasRes.data &&
              (areasRes.data.data || areasRes.data)) ||
            [];
          setAreas(areasData);
        } catch (err) {
          setAreas([]);
        }

        // Preparar params
        const params = {};
        if (soloActivas) params.solo_activas = true;

        let response;
        if (selectedArea) {
          response = await MesasService.getByArea(
            selectedArea,
            sucursal,
            params
          );
        } else {
          response = await MesasService.getBySucursal(sucursal, params);
          console.log("mesas", response);
        }

        const data =
          (response &&
            response.data &&
            (response.data.data || response.data)) ||
          [];
        setMesas(data);
      } catch (error) {
        setMesas([]);
        toast.error("Error cargando mesas");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [sucursal]);

  // Refetch cuando cambian filtros
  useEffect(() => {
    const fetchWithFilters = async () => {
      if (!sucursal) return;
      setLoading(true);
      try {
        const params = {};
        if (soloActivas) params.solo_activas = true;

        let response;
        if (selectedArea) {
          response = await MesasService.getByArea(
            selectedArea,
            sucursal,
            params
          );
        } else {
          response = await MesasService.getBySucursal(sucursal, params);
          console.log("mesas", response);
        }
        const data =
          (response &&
            response.data &&
            (response.data.data || response.data)) ||
          [];
        setMesas(data);
      } catch (error) {
        console.error("Error cargando mesas con filtros", error);
        toast.error("Error cargando mesas");
      } finally {
        setLoading(false);
      }
    };

    fetchWithFilters();
  }, [sucursal, selectedArea, soloActivas]);

  const handleEdit = (mesa) => {
    setEditingMesa(mesa);
    setMesaEditada({
      nombre: mesa.nombre || "",
      capacidad: mesa.capacidad || "",
      descripcion: mesa.descripcion || "",
      es_activa: mesa.es_activa !== undefined ? mesa.es_activa : true,
    });
    setEditError("");
  };

  const handleCloseEdit = () => {
    setEditingMesa(null);
    setMesaEditada({
      nombre: "",
      capacidad: "",
      descripcion: "",
      es_activa: true,
    });
    setEditError("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMesaEditada((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (mesaEditada.capacidad === "" || mesaEditada.capacidad === null) {
      setEditError("La capacidad es requerida");
      return;
    }

    try {
      setEditError("");
      const payload = {
        capacidad: mesaEditada.capacidad ? parseInt(mesaEditada.capacidad) : 0,
      };
      const editingId = editingMesa?.id_mesa ?? editingMesa?.id;
      await MesasService.update(editingId, payload);
      toast.success("Capacidad actualizada correctamente");
      setMesas((prev) =>
        prev.map((m) => ( (m.id_mesa ?? m.id) === editingId ? { ...m, ...payload } : m))
      );
      handleCloseEdit();
    } catch (error) {
      console.error("Error actualizando capacidad de mesa:", error);
      setEditError("Error actualizando la mesa");
      toast.error("Error actualizando la mesa");
    } finally {
    }
  };

  const handleToggleStatus = async (mesaId, currentStatus) => {
    setLoadingActions((prev) => ({ ...prev, [mesaId]: true }));
    try {
      const newStatus = !currentStatus;
      await MesasService.update(mesaId, { es_activa: newStatus });
      setMesas((prev) =>
        prev.map((m) => (m.id === mesaId ? { ...m, es_activa: newStatus } : m))
      );
      toast.success(
        `Mesa ${newStatus ? "activada" : "desactivada"} correctamente`
      );
    } catch (error) {
      console.error("Error actualizando estado mesa:", error);
      toast.error("Error actualizando el estado de la mesa");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [mesaId]: false }));
    }
  };

  const handleOpenDeleteDialog = (mesaId) => {
    setMesaToDelete(mesaId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMesaToDelete(null);
  };

  const handleDelete = async () => {
    if (!mesaToDelete) return;
    // mesaToDelete may be the raw id (number) or an object in other contexts; normalize
    const idToDelete = mesaToDelete?.id_mesa ?? mesaToDelete?.id ?? mesaToDelete;
    setLoadingActions((prev) => ({ ...prev, [idToDelete]: true }));
    try {
      await MesasService.delete(idToDelete);
      // remove by id_mesa or id
      setMesas((prev) => prev.filter((m) => (m.id_mesa ?? m.id) !== idToDelete));
      toast.success("Mesa eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando mesa:", error);
      toast.error("Error eliminando la mesa");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [idToDelete]: false }));
      handleCloseDeleteDialog();
    }
  };

  // Componente para la card en vista de cuadrícula
  const GridCard = ({ mesa }) => {
    // determinar disponibilidad de forma robusta
    const estatusDisplay = mesa?.estatus_display;
    const isDisponible =
      typeof estatusDisplay === "string"
        ? estatusDisplay.toLowerCase().includes("disp")
        : !!mesa?.es_activa;

    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "white",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: colors.primary.main,
            backgroundColor: colors.background.default,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3, pb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: "400", color: colors.primary.dark }}
            >
              Mesa {mesa.id_mesa}
            </Typography>
            <Chip
              label={isDisponible ? "Disponible" : "Ocupada"}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                height: 24,
                color: isDisponible ? colors.primary.dark : colors.status.error,
                borderColor: isDisponible
                  ? colors.primary.dark
                  : colors.status.error,
                bgcolor: isDisponible
                  ? colors.primary.light + "33"
                  : colors.status.error + "33",
              }}
            />
          </Box>
          <Divider sx={{ mb: 2, borderColor: "divider" }} />

          <Box sx={{ mt: "auto", mb: 2 }}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              display="inline-block"
              gutterBottom
            >
              Capacidad:{" "}
              <Typography
                variant="subtitle1"
                color="textSecondary"
                display="inline-block"
                sx={{
                  bgcolor: colors.primary.main,
                  px: 0.8,
                  borderRadius: 1,
                  color: "white",
                }}
              >
                {mesa.capacidad ?? "-"}
              </Typography>
            </Typography>

            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="block"
            >
              Creado:{" "}
              {mesa.created_at
                ? new Date(mesa.created_at).toLocaleDateString()
                : "-"}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="block"
            >
              Estatus: {mesa.estatus_display || "-"}
            </Typography>
          </Box>
        </CardContent>

        <Box
          sx={{
            p: 2,
            pt: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={loadingActions[mesa.id_mesa ?? mesa.id]}
              startIcon={<EditIcon sx={{ fontSize: 18 }} />}
              onClick={() => handleEdit(mesa)}
              sx={{
                color: "#588157",
                borderColor: "#588157",
                "&:hover": { backgroundColor: "#588157", color: "white" },
              }}
            >
              Editar
            </Button>

            <Button
              variant="outlined"
              size="small"
              color="error"
              disabled={loadingActions[mesa.id_mesa ?? mesa.id]}
              startIcon={<DeleteOutlineIcon sx={{ fontSize: 18 }} />}
              onClick={() => handleOpenDeleteDialog(mesa.id_mesa ?? mesa.id)}
              sx={{ "&:hover": { backgroundColor: "#B22222", color: "white" } }}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </Card>
    );
  };

  // Componente para el item en vista de lista
  const ListItem = ({ mesa }) => {
    const estatusDisplay = mesa?.estatus_display;
    const isDisponible =
      typeof estatusDisplay === "string"
        ? estatusDisplay.toLowerCase().includes("disp")
        : !!mesa?.es_activa;

    return (
      <Card
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "white",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: colors.primary.main,
            backgroundColor: colors.background.default,
          },
          mb: 1,
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "400",
                  color: colors.primary.main,
                }}
              >
                Mesa {mesa.id_mesa}
              </Typography>
              <Chip
                label={isDisponible ? "Disponible" : "Ocupada"}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: 24,
                  color: isDisponible
                    ? colors.primary.dark
                    : colors.status.error,
                  borderColor: isDisponible
                    ? colors.primary.dark
                    : colors.status.error,
                  bgcolor: isDisponible
                    ? colors.primary.light + "33"
                    : colors.status.error + "33",
                }}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.4,
                mb: 1,
              }}
            >
              {mesa.descripcion || "Sin descripción"}
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                ID: {mesa.id_mesa}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Capacidad: {mesa.capacidad ?? "-"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Creado:{" "}
                {mesa.created_at
                  ? new Date(mesa.created_at).toLocaleDateString()
                  : "-"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Estatus: {mesa.estatus_display || "-"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => handleEdit(mesa)}
                disabled={loadingActions[mesa.id_mesa ?? mesa.id]}
                size="small"
                sx={{
                  color: colors.primary.dark,
                  "&:hover": {
                    backgroundColor: "action.hover",
                    color: colors.primary.main,
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => handleOpenDeleteDialog(mesa.id_mesa ?? mesa.id)}
                disabled={loadingActions[mesa.id_mesa ?? mesa.id]}
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    color: "error.main",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    );
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
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title="Eliminar Mesa"
        message="¿Estás seguro de que deseas eliminar esta mesa? Esta acción no se puede deshacer."
      />

      {/* Modal de Edición */}
      <Dialog
        open={!!editingMesa}
        onClose={handleCloseEdit}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(88, 129, 87, 0.2)",
            border: `1px solid ${colors.primary}20`,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.primary.main,
            color: "white",
            py: 2,
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: "5%",
              width: "90%",
              height: "2px",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TableBarIcon
              sx={{
                borderRadius: 3,
                bgcolor: "white",
                color: colors.primary.main,
                width: 48,
                height: 48,
              }}
            >
              <EditIcon sx={{ fontSize: 32 }} />
            </TableBarIcon>
            <Box>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                Editar Mesa
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {editingMesa?.nombre}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseEdit}
            sx={{ color: "white" }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmitEdit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {editError && <Alert severity="error">{editError}</Alert>}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: colors.background.default,
                  borderRadius: 1,
                  border: `1px solid ${colors.primary}20`,
                }}
              >
                <Typography variant="body1" fontWeight="medium">
                  Información de la Mesa:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Mesa: {editingMesa?.id_mesa} • Sucursal: {sucursal}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  {editingMesa?.nombre}
                </Typography>
              </Box>

              <TextField
                name="capacidad"
                label="Capacidad"
                value={mesaEditada.capacidad}
                onChange={handleInputChange}
                type="number"
                fullWidth
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  type="button"
                  variant="text"
                  onClick={handleCloseEdit}
                  sx={{
                    color: colors.accent.main,
                    "&:hover": {
                      backgroundColor: colors.accent.light,
                      color: "white",
                    },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{ backgroundColor: colors.primary.main }}
                >
                  Actualizar Mesa
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* Filtros y controles de vista */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 2,
          p: 2,
        }}
      >
        <Typography variant="h5" fontWeight="500">
          Selecciona una área
        </Typography>
        <FormControl
          size="small"
          fullWidth
          sx={{ maxWidth: isMobile ? "100%" : 340 }}
        >
          <InputLabel id="select-area-label">Área</InputLabel>
          <Select
            labelId="select-area-label"
            value={selectedArea}
            label="Área"
            onChange={(e) => setSelectedArea(e.target.value)}
            sx={{
              borderRadius: 2,
              backgroundColor: colors.background,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary,
              },
            }}
          >
            <MenuItem value="">Todas las áreas</MenuItem>
            {areas.map((area) => (
              <MenuItem
                key={area.id_area || area.id}
                value={area.id_area || area.id}
              >
                {area.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Controles de vista */}
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
      <Box
        mt={2}
        sx={{
          background: "linear-gradient(to bottom, #ce8c4e10 0%, #ede0d40c 10%)",
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {mesas.length === 0 ? (
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ py: 8 }}
          >
            No hay mesas registradas
          </Typography>
        ) : viewMode === "grid" ? (
          <Grid container spacing={2}>
            {mesas.map((mesa) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mesa.id_mesa}>
                <GridCard mesa={mesa} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={1}>
            {mesas.map((mesa) => (
              <ListItem key={mesa.id_mesa} mesa={mesa} />
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default CardMesas;
