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

// Validación de campo requerido
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

// Validación de telefono
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-()+]{10,15}$/;
  return phoneRegex.test(phone);
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