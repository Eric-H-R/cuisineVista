import API from '../../../services/api'


 export const CuentaService = {
  getPerfil: () => API.get('/auth/profile'), 
  /* respuesta JSON: 
  {
    "authenticated_as": "jag030317@hotmail.com",
    "message": "Perfil de jag030317@hotmail.com",
    "success": true,
    "token_roles": [
        "Administrador"
    ],
    "user": {
        "acepta_marketing": false,
        "apellido": "SISTEMA",
        "created_at": "2025-10-19 21:57:01",
        "email": "jag030317@hotmail.com",
        "es_activo": true,
        "es_cliente": false,
        "id_usuario": 1,
        "modulos": [
            {
                "clave": "CUENTA",
                "descripcion": "Gestión de la cuenta que ha iniciado sesión",
                "es_activo": true,
                "id_modulo": 1,
                "nombre": "Cuenta"
            },
           
        ],
        "nombre": "ADMIN",
        "roles": [
            {
                "descripcion": "Administrador del sistema con permisos superiores",
                "id_rol": 1,
                "nombre": "Administrador"
            }
        ],
        "sucursales": [],
        "telefono": "+1234567890",
        "tipo_acceso": "WEB",
        "updated_at": "2025-11-17 07:55:12"
    }
}*/
  // Cambiar contraseña 
    changePassword: (data) => API.post('/auth/cambiar-password', data),
    // JSON para enviar 
    /* {
  "current_password": "currentPass123",
  "new_password": "newPass456"
}*/
    // Actualizar información de la cuenta
    updateProfile: (id, data) => API.put(`/usuarios/${id}`, data),
    /* JSON para enviar
    {
  "apellido": "string",
  "email": "string",
  "nombre": "string"
}*/
 };

 export default CuentaService;