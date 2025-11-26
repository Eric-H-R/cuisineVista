// utils/validations.js

// Validación de email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de contraseña
export const validatePassword = (password) => {
  return password.length >= 6;
};
// Al menos una letra mayúscula
export const hasUpperCase = (password) => {
  return /[A-Z]/.test(password);
}

// Al menos un número
export const hasNumber = (password) => {
  return /[0-9]/.test(password);
};

// Validación de campo requerido
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  
  // Si es número, considerar que está lleno (incluso 0)
  if (typeof value === 'number') return true;
  
  // Si es string, verificar que no esté vacío después de trim
  if (typeof value === 'string') return value.trim().length > 0;
  
  // Si es array, verificar que tenga elementos
  if (Array.isArray(value)) return value.length > 0;
  
  // Para otros tipos (boolean, object), considerar que está lleno
  return true;
};

// Validación de telefono
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-()+]{10,15}$/;
  return phoneRegex.test(phone);
};

// Validación de nombre de sucursal
export const validateNombreSucursal = (nombre) => {
  return nombre && nombre.trim().length >= 3;
};

// Validación de dirección
export const validateDireccion = (direccion) => {
  return direccion && direccion.trim().length >= 10;
};

// Validaciones especificas para login
export const loginValidations = {
  email: (value) => {
    if (!validateRequired(value)) return 'El email es requerido';
    if (!validateEmail(value)) return 'Ingresa un email válido';
    return '';
  },
  password: (value) => {
    if (!validateRequired(value)) return 'La contraseña es requerida';
    if (!validatePassword(value)) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }
};

// Validaciones especificas para usuarios
export const userValidations = {
  nombre: (value) => {
    if (!validateRequired(value)) return 'El nombre es requerido';
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return '';
  },
  
  apellido: (value) => {
    if (!validateRequired(value)) return 'El apellido es requerido';
    if (value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres';
    return '';
  },
  
  email: (value, isEditing = false) => {
    if (!validateRequired(value)) return 'El email es requerido';
    if (!validateEmail(value)) return 'Ingresa un email válido';
    return '';
  },
  
  telefono: (value) => {
    if (!validateRequired(value)) return 'El teléfono es requerido';
    if (!validatePhone(value)) return 'El teléfono debe tener entre 10 y 15 caracteres';
    return '';
  },
  
  password: (value, isEditing = false) => {
    if (!isEditing && !validateRequired(value)) return 'La contraseña es requerida';
    if (!isEditing && !validatePassword(value)) return 'La contraseña debe tener al menos 6 caracteres';
    if (!isEditing && !hasUpperCase(value)) return 'La contraseña debe contener al menos una letra mayúscula';
    if (!isEditing && !hasNumber(value)) return 'La contraseña debe contener al menos un número';
    return '';
  },
  
  rol_id: (value) => {
    if (!value) return 'El rol es requerido';
    return '';
  },
  
  sucursal_id: (value) => {
    if (!value) return 'La sucursal es requerida';
    return '';
  }
};

// Función de validación completa para el formulario de usuario
export const validateUserForm = (formData, isEditing = false) => {
  const errors = {};
  
  errors.nombre = userValidations.nombre(formData.nombre);
  errors.apellido = userValidations.apellido(formData.apellido);
  errors.email = userValidations.email(formData.email, isEditing);
  errors.telefono = userValidations.telefono(formData.telefono);
  errors.password = userValidations.password(formData.password, isEditing);
  errors.rol_id = userValidations.rol_id(formData.rol_id);
  errors.sucursal_id = userValidations.sucursal_id(formData.sucursal_id);
  
  // Filtrar solo los campos con errores
  const hasErrors = Object.values(errors).some(error => error !== '');
  
  return {
    errors,
    isValid: !hasErrors
  };
};


export const sucursalValidations = {
  nombre: (value) => {
    if (!validateRequired(value)) return 'El nombre de la sucursal es requerido';
    if (!validateNombreSucursal(value)) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  },
  
  direccion: (value) => {
    if (!validateRequired(value)) return 'La dirección es requerida';
    if (!validateDireccion(value)) return 'La dirección debe tener al menos 10 caracteres';
    return '';
  },
  
  telefono: (value) => {
    if (!validateRequired(value)) return 'El teléfono es requerido';
    if (!validatePhone(value)) return 'El teléfono debe tener entre 10 y 15 dígitos';
    return '';
  }
};

export const validateSucursalForm = (formData) => {
  const errors = {};
  
  errors.nombre = sucursalValidations.nombre(formData.nombre);
  errors.direccion = sucursalValidations.direccion(formData.direccion);
  errors.telefono = sucursalValidations.telefono(formData.telefono);
  
  // Filtrar solo los campos con errores
  const hasErrors = Object.values(errors).some(error => error !== '');
  
  return {
    errors,
    isValid: !hasErrors
  };
};

// Validaciones específicas para horarios
export const horarioValidations = {
  clave: (value) => {
    if (!validateRequired(value)) return 'La clave del horario es requerida';
    if (value.trim().length < 3) return 'La clave debe tener al menos 3 caracteres';
    return '';
  },
  
  nombre: (value) => {
    if (!validateRequired(value)) return 'El nombre del horario es requerido';
    if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  },
  
  descripcion: (value) => {
    if (!validateRequired(value)) return 'La descripción es requerida';
    if (value.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres';
    return '';
  },
  
  sucursal_id: (value) => {
    if (!value) return 'La sucursal es requerida';
    return '';
  }
};

// Validaciones para detalles de horario
export const horarioDetalleValidations = {
  dia_semana: (value) => {
    if (!value && value !== 0) return 'El día de la semana es requerido';
    return '';
  },
  
  hora_inicio: (value) => {
    if (!validateRequired(value)) return 'La hora de inicio es requerida';
    return '';
  },
  
  hora_fin: (value) => {
    if (!validateRequired(value)) return 'La hora de fin es requerida';
    return '';
  },
  
  tolerancia_min: (value) => {
    if (!value && value !== 0) return 'La tolerancia es requerida';
    if (value < 0) return 'La tolerancia no puede ser negativa';
    return '';
  }
};

export const validateHorarioForm = (formData) => {
  const errors = {};
  
  errors.clave = horarioValidations.clave(formData.clave);
  errors.nombre = horarioValidations.nombre(formData.nombre);
  errors.descripcion = horarioValidations.descripcion(formData.descripcion);
  errors.sucursal_id = horarioValidations.sucursal_id(formData.sucursal_id);
  
  const hasErrors = Object.values(errors).some(error => error !== '');
  
  return {
    errors,
    isValid: !hasErrors
  };
};


// Validaciones específicas para unidades de medida
export const unidadesValidations = {
  clave: (value) => {
    if (!validateRequired(value)) return 'La clave es requerida';
    if (value.trim().length < 1) return 'La clave es requerida';
    if (value.trim().length > 29) return 'La clave no puede exceder 29 caracteres';
    if (!/^[A-Za-z0-9_]+$/.test(value)) return 'Solo letras, números y guiones bajos';
    return '';
  },
  
  nombre: (value) => {
    if (!validateRequired(value)) return 'El nombre es requerido';
    if (value.trim().length < 1) return 'El nombre es requerido';
    if (value.trim().length > 30) return 'El nombre no puede exceder 30 caracteres';
    return '';
  }
};

// Función de validación completa para el formulario de unidades
export const validateUnidadForm = (formData, isEditing = false) => {
  const errors = {};
  
  errors.clave = unidadesValidations.clave(formData.clave);
  errors.nombre = unidadesValidations.nombre(formData.nombre);
  
  // Filtrar solo los campos con errores (eliminar campos sin error)
  Object.keys(errors).forEach(key => {
    if (errors[key] === '') {
      delete errors[key];
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};


// Validaciones específicas para insumos
export const insumosValidations = {
  nombre: (value) => {
    if (!value || value.trim().length === 0) return 'El nombre es requerido';
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (value.trim().length > 100) return 'El nombre no puede exceder 100 caracteres';
    return '';
  },
  
  minimo_stock: (value) => {
    if (value === null || value === undefined || value === '') return 'El stock mínimo es requerido';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'El stock mínimo debe ser un número válido';
    if (numValue < 0) return 'El stock mínimo no puede ser negativo';
    return '';
  },
  
  unidad_id: (value) => {
    if (!value) return 'La unidad de medida es requerida';
    return '';
  }
};

// Función de validación completa para el formulario de insumos
export const validateInsumoForm = (formData) => {
  const errors = {};
  
  errors.nombre = insumosValidations.nombre(formData.nombre);
  errors.minimo_stock = insumosValidations.minimo_stock(formData.minimo_stock);
  errors.unidad_id = insumosValidations.unidad_id(formData.unidad_id);
  
  // Filtrar solo los campos con errores
  Object.keys(errors).forEach(key => {
    if (errors[key] === '') {
      delete errors[key];
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};


// Validaciones específicas para proveedores
export const proveedoresValidations = {
  nombre: (value) => {
    if (!value || value.trim().length === 0) return 'El nombre es requerido';
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (value.trim().length > 100) return 'El nombre no puede exceder 100 caracteres';
    return '';
  },
  
  email: (value) => {
    if (!value || value.trim().length === 0) return 'El email es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Ingresa un email válido';
    return '';
  },
  
  telefono: (value) => {
    if (!value || value.trim().length === 0) return 'El teléfono es requerido';
    const phoneRegex = /^[\d\s\-()+]{10,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'El teléfono debe tener entre 10 y 15 dígitos';
    return '';
  }
};

// Función de validación completa para el formulario de proveedores
export const validateProveedorForm = (formData) => {
  const errors = {};
  
  errors.nombre = proveedoresValidations.nombre(formData.nombre);
  errors.email = proveedoresValidations.email(formData.email);
  errors.telefono = proveedoresValidations.telefono(formData.telefono);
  
  // Filtrar solo los campos con errores
  Object.keys(errors).forEach(key => {
    if (errors[key] === '') {
      delete errors[key];
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};


// Validaciones específicas para compras
export const comprasValidations = {
  proveedor_id: (value) => {
    if (!value) return 'El proveedor es requerido';
    return '';
  },
};

// Validaciones para detalles de compra
export const compraDetalleValidations = {
  insumo_id: (value) => {
    if (!value) return 'El insumo es requerido';
    return '';
  },
  
  cant_presentacion: (value) => {
    if (!value && value !== 0) return 'La cantidad es requerida';
    if (value <= 0) return 'La cantidad debe ser mayor a 0';
    return '';
  },
  
  costo_unit_present: (value) => {
    if (!value && value !== 0) return 'El costo unitario es requerido';
    if (value <= 0) return 'El costo unitario debe ser mayor a 0';
    return '';
  },
  
  presentacion: (value) => {
    if (!value || value.trim().length === 0) return 'La presentación es requerida';
    if (value.trim().length < 2) return 'La presentación debe tener al menos 2 caracteres';
    return '';
  }
};

// Función de validación completa para el formulario de compras
export const validateCompraForm = (formData) => {
  const errors = {};
  
  errors.proveedor_id = comprasValidations.proveedor_id(formData.proveedor_id);

  // Validar detalles
  if (!formData.detalles || formData.detalles.length === 0) {
    errors.detalles = 'Debe agregar al menos un insumo a la compra';
  } else {
    formData.detalles.forEach((detalle, index) => {
      const detalleErrors = {};
      
      detalleErrors.insumo_id = compraDetalleValidations.insumo_id(detalle.insumo_id);
      detalleErrors.cant_presentacion = compraDetalleValidations.cant_presentacion(detalle.cant_presentacion);
      detalleErrors.costo_unit_present = compraDetalleValidations.costo_unit_present(detalle.costo_unit_present);
      detalleErrors.presentacion = compraDetalleValidations.presentacion(detalle.presentacion);
      
      // Filtrar errores vacíos
      Object.keys(detalleErrors).forEach(key => {
        if (detalleErrors[key] === '') {
          delete detalleErrors[key];
        }
      });
      
      if (Object.keys(detalleErrors).length > 0) {
        if (!errors.detalles) errors.detalles = [];
        errors.detalles[index] = detalleErrors;
      }
    });
  }
  
  // Filtrar solo los campos con errores
  Object.keys(errors).forEach(key => {
    if (errors[key] === '') {
      delete errors[key];
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};






// utils/validations.js - AGREGAR AL FINAL DEL ARCHIVO

// Validaciones específicas para recepciones
export const recepcionesValidations = {
  compra_id: (value) => {
    if (!value) return 'La compra es requerida';
    return '';
  },
  
  recibido_por: (value) => {
    if (!value) return 'El usuario que recibe es requerido';
    return '';
  },
  
  sucursal_id: (value) => {
    if (!value) return 'La sucursal es requerida';
    return '';
  }
};

// Validaciones para detalles de recepción
export const recepcionDetalleValidations = {
  insumo_id: (value) => {
    if (!value) return 'El insumo es requerido';
    return '';
  },
  
  cant_presentacion: (value) => {
    if (!value && value !== 0) return 'La cantidad es requerida';
    if (value <= 0) return 'La cantidad debe ser mayor a 0';
    return '';
  },
  
  unidades_por_present: (value) => {
    if (!value && value !== 0) return 'Las unidades por presentación son requeridas';
    if (value <= 0) return 'Las unidades por presentación deben ser mayor a 0';
    return '';
  },
  
  costo_unitario: (value) => {
    if (value && value < 0) return 'El costo unitario no puede ser negativo';
    return '';
  },
  
  fecha_caducidad: (value) => {
    if (value) {
      const fechaCaducidad = new Date(value);
      const hoy = new Date();
      if (fechaCaducidad < hoy) return 'La fecha de caducidad no puede ser en el pasado';
    }
    return '';
  },
  
  lote_proveedor: (value) => {
    if (!value || value.toString().trim().length === 0) return 'El lote del proveedor es requerido';
    if (value.length > 50) return 'El lote del proveedor no puede exceder 50 caracteres';
    return '';
  }
};

// Función de validación completa para el formulario de recepciones
export const validateRecepcionForm = (formData) => {
  const errors = {};
  
  errors.compra_id = recepcionesValidations.compra_id(formData.compra_id);
  errors.recibido_por = recepcionesValidations.recibido_por(formData.recibido_por);
  errors.sucursal_id = recepcionesValidations.sucursal_id(formData.sucursal_id);

  // Validar detalles
  if (!formData.detalles || formData.detalles.length === 0) {
    errors.detalles = 'Debe agregar al menos un detalle a la recepción';
  } else {
    formData.detalles.forEach((detalle, index) => {
      const detalleErrors = {};
      
      detalleErrors.insumo_id = recepcionDetalleValidations.insumo_id(detalle.insumo_id);
      detalleErrors.cant_presentacion = recepcionDetalleValidations.cant_presentacion(detalle.cant_presentacion);
      detalleErrors.unidades_por_present = recepcionDetalleValidations.unidades_por_present(detalle.unidades_por_present);
      detalleErrors.costo_unitario = recepcionDetalleValidations.costo_unitario(detalle.costo_unitario);
      detalleErrors.fecha_caducidad = recepcionDetalleValidations.fecha_caducidad(detalle.fecha_caducidad);
      //detalleErrors.lote_numero = recepcionDetalleValidations.lote_numero(detalle.lote_numero);
      detalleErrors.lote_proveedor = recepcionDetalleValidations.lote_proveedor(detalle.lote_proveedor);
      
      // Filtrar errores vacíos
      Object.keys(detalleErrors).forEach(key => {
        if (detalleErrors[key] === '') {
          delete detalleErrors[key];
        }
      });
      
      if (Object.keys(detalleErrors).length > 0) {
        if (!errors.detalles) errors.detalles = [];
        errors.detalles[index] = detalleErrors;
      }
    });
  }
  
  // Filtrar solo los campos con errores
  Object.keys(errors).forEach(key => {
    if (errors[key] === '') {
      delete errors[key];
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Función de validación para cancelar recepción
export const validateCancelarRecepcionForm = (formData) => {
  const errors = {};
  
  if (formData.revertir_compra === undefined || formData.revertir_compra === null) {
    errors.revertir_compra = 'La opción de revertir compra es requerida';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};


// Validaciones específicas para productos
export const productosValidations = {
  nombre: (value) => {
    if (!validateRequired(value)) return 'El nombre del producto es requerido';
    const nombreStr = String(value || '').trim();
    if (nombreStr.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (nombreStr.length > 100) return 'El nombre no puede exceder 100 caracteres';
    return '';
  },
  
  descripcion: (value) => {
    if (!validateRequired(value)) return 'La descripción es requerida';
    const descripcionStr = String(value || '').trim();
    if (descripcionStr.length < 10) return 'La descripción debe tener al menos 10 caracteres';
    return '';
  },
  
  precio: (value) => {
    if (value === null || value === undefined || value === '') 
      return 'El precio es requerido';
    
    const precioNum = parseFloat(value);
    if (isNaN(precioNum)) return 'El precio debe ser un número válido';
    if (precioNum < 0) return 'El precio no puede ser negativo';
    return '';
  },
  
  categoria_id: (value) => {
    if (!value && value !== 0) return 'La categoría es requerida';
    return '';
  },
  
  receta_items: (value) => {
    if (!value || value.length === 0) return 'Debe agregar al menos un ingrediente a la receta';
    return '';
  }
};

// Función de validación completa para el formulario de productos
// Función de validación completa para el formulario de productos (CORREGIDA)
export const validateProductoForm = (formData, isEditing = false) => {
  const errors = {};
  
  errors.nombre = productosValidations.nombre(formData.nombre);
  errors.descripcion = productosValidations.descripcion(formData.descripcion);
  errors.precio = productosValidations.precio(formData.precio);
  
  // Solo validar categoria_id en creación, no en edición
  if (!isEditing) {
    errors.categoria_id = productosValidations.categoria_id(formData.categoria_id);
  }
  
  // Validar receta_items solo en creación
  if (!isEditing) {
    errors.receta_items = productosValidations.receta_items(formData.receta_items);
  }
  
  // Filtrar solo los campos con errores
  Object.keys(errors).forEach(key => {
    if (errors[key] === '') {
      delete errors[key];
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};