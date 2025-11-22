import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import CardOption from "../components/CardOption";
import Tooltip from '@mui/material/Tooltip';

const Cuenta = () => {

    // funcion con Avatar para poner las iniciales del usuario

    function stringToColor(string) {
        let hash = 0;
        let i;
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }
    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
                with: 100,
                height: 100,
                
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

  return (
    <Container maxWidth="xl" sx={{ mt: 7 }}>
        <Box sx={{ display: 'flex', gap: 2 , justifyContent: 'center', alignItems: 'center', mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar {...stringAvatar('Juan Pérez')}  sx={{ width: 100, height: 100, bgcolor: '#603808', fontSize: 40, boxShadow: 10 }}/>
            </Stack>
          </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Administrador
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administración del perfil del usuario
            </Typography>
          </Box>
        </Box>
        <CardOption />
    </Container>
    );
};

export default Cuenta;
