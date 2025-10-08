import { Box, Card } from '@mui/material'
import { FormControl } from '@mui/material'
import { FormLabel } from '@mui/material'
import { TextField } from '@mui/material'
import { FormControlLabel } from '@mui/material'
import { Checkbox } from '@mui/material'
import { CardHeader } from '@mui/material'
import { Button } from '@mui/material'
import { useNavigate } from "react-router-dom";

export default function Login() {

   const navigate = useNavigate();

  const handleLogin = () => {
    //Solo sirve para redirigir por el momento no se hizo validaciones o rutas protegidas amigo
    navigate("/dashboard");
  };

  return (
    <Card variant='outlined' sx={{ p: 4, width: 300, m: 'auto', mt: 5 }} color='secondary'>
    <CardHeader title="Iniciar Sesión" sx={{ textAlign: 'center', mb: 3 }} />
    <Box component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
            <FormLabel htmlFor='name' sx={{textAlign: 'left'}}>Usuario</FormLabel>
            <TextField
                required
                fullWidth
                id="name"
                placeholder="Username"
              />
        </FormControl>
        <FormControl>
            <FormLabel htmlFor='password' sx={{textAlign: 'left'}}>Contraseña</FormLabel>
            <TextField
                required
                fullWidth
                id="password"
                type="password"
                placeholder="Password"
              />
        </FormControl>
        <FormControlLabel
              control={<Checkbox value="recordarme" />}
              label="Remember me"
            />
             <Button
              type="submit"
              fullWidth
              variant="outlined"
              onClick={handleLogin}
              >
              Sign up
            </Button>
    </Box>
</Card>
  )
}