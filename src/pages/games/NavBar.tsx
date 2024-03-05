// /src/components/MyNavbar.tsx
import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

interface MyNavbarProps {
  setUnitySrc: (src: string) => void
}

const MyNavbar: React.FC<MyNavbarProps> = ({ setUnitySrc }) => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Spacecreator
        </Typography>
        <Button
          color='inherit'
          onClick={() =>
            setUnitySrc('https://futuraspaceserver4.link/mini_games/bridge_game_client/Build/bridge_game_client')
          }
        >
          Bridge
        </Button>
        <Button
          color='inherit'
          onClick={() =>
            setUnitySrc('https://futuraspaceserver4.link/mini_games/platform_game_client/Build/platform_game_client')
          }
        >
          Platform
        </Button>
        <Button
          color='inherit'
          onClick={() =>
            setUnitySrc(
              'https://futuraspaceserver4.link/mini_games/mountainking_game_client/Build/mountainking_game_client'
            )
          }
        >
          Mountainking
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default MyNavbar
