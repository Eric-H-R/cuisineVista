import { Box, Tabs, Tab, Grid } from '@mui/material';
import CardPendientes from './CardPendientes';
import CardReservas from './CardReservas';
import PropTypes from 'prop-types';
import React from 'react';


const ReservasTabs = ({ pendientes, reservas }) => {
  const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
    setValue(newValue);
  };

    const tabsData = [
      { label: 'Reservas', count: reservas.length },
    { label: 'Pendientes', count: pendientes.length },
   
  ];

    return (

<Box>
        {/* Tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'start' }}>
            <Box
                sx={{
                    display: 'inline-flex',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '24px',
                    backgroundColor: '#EDE0D4',
                    p: 0.5,
                    width: { xs: '100%', sm: 'auto' }
                }}
                >
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                sx={{
                    minHeight: '40px',
                    '& .MuiTab-root': {
                        minHeight: '32px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        color: 'text.primary',
                        borderRadius: '20px',
                        mx: 0.5,
                        minWidth: { xs: 'auto', sm: '100px' },
                        px: { xs: 2, sm: 3 },
                        '&.Mui-selected': {
                        color: 'text.primary',
                        fontWeight: 600,
                        backgroundColor: 'grey.100'
                        }
                    },
                    '& .MuiTabs-indicator': {
                        display: 'none'
                    }
                    }}
                    >
                    {tabsData.map((tab, index) => (
                        <Tab 
                        key={index}
                        label={`${tab.label} (${tab.count})`}
                        />
                    ))}
                </Tabs>
            </Box>
        </Box>
                    {/* Contenido del Tab seleccionado */}

        <Box>
          {value === 0 && (
            <Grid container spacing={5}>
            {reservas.map((reserva) => (
                <Grid item size={12} sm={6} md={4} key={reserva.id}>
                <CardReservas reserva={reserva} />
                </Grid>
            ))}
            </Grid>
        )}   
        {value === 1 && ( //Tab de reservas pendientes
            <Grid container spacing={5}>
            {pendientes.map((pendiente) => (
                <Grid item xs={12} sm={6} md={4} key={pendiente.id}>
                <CardPendientes pendiente={pendiente} />
                </Grid>
            ))}
            </Grid>
        )}
        </Box>
    </Box>
    );
};

ReservasTabs.propTypes = {
  pendientes: PropTypes.array.isRequired,
  reservas: PropTypes.array.isRequired
};


export default ReservasTabs;