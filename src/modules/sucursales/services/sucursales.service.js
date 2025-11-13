import API from '../../../services/api'
import { createApiService }  from '../../../services/apiFactory'

const sucursalesService = {
  ...createApiService("sucursales"),
};

export default sucursalesService;