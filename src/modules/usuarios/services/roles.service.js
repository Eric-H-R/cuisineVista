import API from '../../../services/api'
import { createApiService }  from '../../../services/apiFactory'

const rolesService = {
  ...createApiService("roles"),
  modulos: () => API.get('/roles/modulos'),
};

export default rolesService;