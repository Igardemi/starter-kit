import React, { useState } from 'react'
import { Box } from '@mui/material'
import Navbar from './NavBar'
import BridgeUnity from './BridgeUnity'
import PlatformUnity from './PlatformUnity'
import MountainUnity from './MountainUnity'

function Games() {
  const [unitySrc, setUnitySrc] = useState('')

  // Función para renderizar el componente de Unity basado en unitySrc
  const renderUnityComponent = () => {
    switch (unitySrc) {
      case 'bridge':
        return <BridgeUnity />
      case 'platform':
        return <PlatformUnity />
      case 'mountain':
        return <MountainUnity />
      default:
        return (
          <Box display='flex' height='100%'>
            Select a game from the navbar.
          </Box>
        )
    }
  }

  return (
    <Box>
      <Navbar onSelect={setUnitySrc} />
      <Box
        display='flex'
        height='100%'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        sx={{ backgroundColor: 'black' }}
      >
        {renderUnityComponent()}
      </Box>
    </Box>
  )
}

export default Games
