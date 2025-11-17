export const usuarioAdapter = (userData) => {
  return {
    id: userData.id_usuario,
    name: `${userData.nombre} ${userData.apellido}`,
    email: userData.email,
    phone: userData.telefono,
    status: 'Activo', 
    lastAccess: 'Reciente', 
    memberSince: userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A',
    branches: userData.sucursales?.length
      ? userData.sucursales.map(s => s.nombre)
      : [],
    roles: userData.roles 
      ? userData.roles.map(r => r.nombre)
      : ['Sin rol'],
    es_cliente: userData.es_cliente,
    es_admin: userData.es_admin,
    modulos: userData.modulos || [],
    rawData: userData
  };
};

export const listaUsuariosAdapter = (apiResponse) => {
  if (!apiResponse?.success || !Array.isArray(apiResponse.data)) {
    return [];
  }
  
  return apiResponse.data.map(usuarioAdapter);
};

export const separarUsuariosYClientes = (usuarios) => {
  const usuariosNormales = usuarios.filter(user => !user.es_cliente);
  const clientes = usuarios.filter(user => user.es_cliente);
  return { usuariosNormales, clientes };
}