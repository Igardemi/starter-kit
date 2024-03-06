// /src/components/MyNavbar.tsx
import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

interface MyNavbarProps {
  onSelect: (src: string) => void
}

const Navbar: React.FC<MyNavbarProps> = ({ onSelect }) => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Spacecreator
        </Typography>
        {/* Botones para seleccionar el componente de Unity */}
        <Button color='inherit' onClick={() => onSelect('bridge')}>
          Bridge
        </Button>
        <Button color='inherit' onClick={() => onSelect('platform')}>
          Platform
        </Button>
        <Button color='inherit' onClick={() => onSelect('mountain')}>
          Mountainking
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
