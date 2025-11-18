import API from '../../../services/api'
import { createApiService }  from '../../../services/apiFactory'

const usuarioService = {
  ...createApiService("usuarios"),
  createUser: (data) => API.post(`/usuarios/empleado`, data),
};

export default usuarioService;