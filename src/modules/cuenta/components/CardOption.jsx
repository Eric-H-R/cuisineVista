import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";


const CardOption = () => {
    
    
    const OpcionesCard = [
    { 
      title: 'En este apartado puedes administrar la información de tu cuenta', 
      value: 'Administrar información'
    },
    { 
      title: 'Aquí puedes cambiar tu contraseña de acceso', 
      value: 'Restablecer contraseña'
    },
    { 
      title: 'En este apartado puedes administrar la información de tu cuenta', 
      value: 'Restablecer contraseña'
    },
  ];
 
    return (
        <Box mt={10} sx={{ display: 'flex', gap: 2, justifyContent: 'space-around', width: '100%' }}>
        {OpcionesCard.map((card, index) => (
            <Card key={index}
             elevation={0} 
            sx={{ width: '45%', height: 160, borderRadius: 4, justifyContent: 'justify', display: 'flex' , p:1}}
            >
                <CardContent sx={{ height: '100%', textAlign: 'start' }}>
                <Typography variant="h5" component="div" >
                    {card.value}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {card.title}
                </Typography>
                </CardContent>
            </Card>
        ))}
    </Box>
    )
};
export default CardOption;