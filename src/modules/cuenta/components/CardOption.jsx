import React from "react";
import { Box, Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import colores from "../../../theme/colores";

const CardOption = ({ onEditProfile, onChangePassword, onViewInfo, user }) => {
    const OpcionesCard = [
    { 
      title: 'Administra y actualiza la información personal de tu cuenta', 
      value: 'Perfil',
      action: onEditProfile,
      icon: <PersonIcon />,
      color: colores.primary.dark
    },
    { 
      title: 'Actualiza tu contraseña para mantener tu cuenta segura', 
      value: 'Contraseña',
      action: onChangePassword,
      icon: <SecurityIcon />,
      color: colores.primary.main
    },
    { 
      title: 'Información del usuario actualmente autenticado en el sistema', 
      value: user?.nombre || 'Usuario',
      action: onViewInfo,
      icon: <EditIcon />,
      color: colores.primary.light
    },
  ];
 
    return (
        <Box mt={3} sx={{ 
            display: 'flex', 
            gap: 3,
            justifyContent: 'center', 
            width: '100%',
            flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}>
        {OpcionesCard.map((card, index) => (
            <Card 
                key={index}
                elevation={0} 
                sx={{ 
                    height: 300, 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        borderColor: card.color
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    p: 0,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* BORDE TOP */}
                <Box 
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 6,
                        background: `linear-gradient(90deg, ${card.color}, ${card.color}80)`
                    }}
                />

                {/* Header con icono */}
                <Box 
                    sx={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        p:3,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: `${card.color}15`,
                            color: card.color,
                            mr: 2,
                            flexShrink: 0
                        }}
                    >
                        {card.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                color: 'text.primary',
                                lineHeight: 1.2
                            }}
                        >
                            {card.value}
                        </Typography>
                        {card.subtitle && (
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'text.secondary',
                                    fontSize: '0.875rem',
                                    mt: 0.5
                                }}
                            >
                                {card.subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Contenido */}
                <CardContent sx={{ 
                    flex: 1, 
                    p: 3, 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            lineHeight: 1.5,
                            fontSize: '0.9rem',
                          
                        }}
                    >
                        {card.title}
                    </Typography>
                    
                    <Button 
                        variant="outlined" 
                        onClick={() => card.action && card.action()}
                        sx={{ 
                            alignSelf: 'flex-start',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            borderColor: 'divider',
                            color: 'text.primary',
                            '&:hover': {
                                borderColor: card.color,
                                backgroundColor: `${card.color}08`,
                                transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Gestionar
                    </Button>
                </CardContent>
            </Card>
        ))}
    </Box>
    )
};

export default CardOption;