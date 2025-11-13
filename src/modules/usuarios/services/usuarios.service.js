import API from '../../../services/api'
import { createApiService }  from '../../../services/apiFactory'

const authService = {
  ...createApiService("auth"),
  login: (data) => API.post(`/auth/login`, data),
};

export default authService;