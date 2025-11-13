import API from '../../../services/api'
import { createApiService }  from '../../../services/apiFactory'

const rolesService = {
  ...createApiService("roles"),
};

export default rolesService;