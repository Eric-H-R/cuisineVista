import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";


const CardOption = ({ onEditProfile, onChangePassword, onViewInfo, user }) => {
    const OpcionesCard = [
    { 
      title: 'En este apartado puedes administrar la información de tu cuenta', 
      value: 'Administrar información',
      action: onEditProfile
    },
    { 
      title: 'Aquí puedes cambiar tu contraseña de acceso', 
      value: 'Restablecer contraseña',
      action: onChangePassword
    },
    { 
      title: 'Información del usuario autenticado', 
      value: user?.nombre || 'Usuario',
      action: onViewInfo
    },
  ];
 
    return (
        <Box mt={3} sx={{ display: 'flex', gap: 2, justifyContent: 'space-around', width: '100%' }}>
        {OpcionesCard.map((card, index) => (
            <Card key={index}
             elevation={0} 
            sx={{ width: '30%', minWidth: 260, height: 160, borderRadius: 4, justifyContent: 'space-between', display: 'flex' , p:2}}
            >
                <CardContent sx={{ height: '100%', textAlign: 'start' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    {card.title}
                </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                  <Button variant="outlined" onClick={() => card.action && card.action()}>
                    Ver
                  </Button>
                </Box>
            </Card>
        ))}
    </Box>
    )
};
export default CardOption;