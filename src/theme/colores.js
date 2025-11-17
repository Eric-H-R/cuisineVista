// src/theme/colors.js

const colors = {
  // Verde principal (primario)
  primary: {
    main: '#588157',
    light: '#7AA67A',
    dark: '#486A47',
    contrastText: '#FFFFFF'
  },
  
  // Verde secundario
  secondary: {
    main: '#A3B18A',
    light: '#B8C4A4',
    dark: '#8A9A76', 
    contrastText: '#333333'
  },
  
  // Marrón acento
  accent: {
    main: '#57300D',
    light: '#78583A',
    dark: '#3D2108',
    contrastText: '#FFFFFF'
  },
  
  // Colores de fondo
  background: {
    default: '#F8F9FA',
    paper: '#EDE0D4',
    light: '#FFFFFF'
  },
  
  // Colores de texto
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999'
  },
  
  // Estados y feedback
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3'
  },
  
  // Bordes y divisiones
  border: {
    light: '#E0E0E0',
    main: '#CCCCCC',
    dark: '#999999'
  },
  
  // Transparencias
  alpha: {
    10: '1A', // 10% opacity
    20: '33', // 20% opacity
    30: '4D', // 30% opacity
    40: '66', // 40% opacity
    50: '80'  // 50% opacity
  }
};

// Funciones helper para transparencias
export const withAlpha = (color, alpha = '20') => {
  return color + alpha;
};

export default colors;