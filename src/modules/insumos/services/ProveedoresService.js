import { createApiService } from "../../../services/apiFactory";

const proveedoresApi = {
    ...createApiService("proveedores")
}

export default proveedoresApi;