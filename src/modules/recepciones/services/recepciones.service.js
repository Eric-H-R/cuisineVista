import { data } from 'react-router-dom';
import API from '../../../services/api';

const recepcionesService = {
    // Obtener recepciones por sucursal
    getAllRecepciones: (sucursalId) => {
        return API.get(`/recepciones?sucursal_id=${sucursalId}`);
    },

    // Obtener recepcion por ID
    getByIdRecepcion: (recepcionId) => {
        return API.get(`/recepciones/${recepcionId}`);
    },

    // Crear nueva recepcion
    createRecepcion: (data) => {
        return API.post('/recepciones', data);
    },

    //Cancelar Recepcion
        /*
        Datos que recibe el endpoint:
        {
    "revertir_compra": true
    } 
    */
    cancelarRecepcion: (recepcionId, data) => {
        return API.patch(`/recepciones/${recepcionId}/cancelar`, data);
    }
};

export default recepcionesService;