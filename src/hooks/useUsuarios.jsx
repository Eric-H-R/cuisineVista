import { useState, useEffect } from 'react';
import usuarioService from '../modules/usuarios/services/usuarios.service';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para separar usuarios normales de clientes
  const separarUsuariosYClientes = (users) => {
    const usuariosNormales = users.filter(user => 
      user.es_cliente === false || user.es_cliente === 0
    );
    const clientes = users.filter(user => 
      user.es_cliente === true || user.es_cliente === 1
    );
    return { usuariosNormales, clientes };
  };

  // Adaptador - usar id_usuario en lugar de id
  const listaUsuariosAdapter = (users) => {
    if (!Array.isArray(users)) {
      return [];
    }
    
    return users.map(user => ({
      id: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      es_activo: user.es_activo !== undefined ? user.es_activo : true,
      es_cliente: user.es_cliente !== undefined ? user.es_cliente : false,
      telefono: user.telefono || '',
      sucursal_id: user.sucursal_id
    }));
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const usuarioResponse = await usuarioService.getAll();
      const adaptedUsers = listaUsuariosAdapter(usuarioResponse?.data?.data || []);
      const { usuariosNormales } = separarUsuariosYClientes(adaptedUsers);
      setUsuarios(usuariosNormales);
      
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar los usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return { usuarios, loading, error, refetch: cargarUsuarios };
};