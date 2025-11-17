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
  return value && value.trim().length > 0;
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