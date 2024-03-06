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
        return <div>Select a game from the navbar.</div>
    }
  }

  return (
    <Box>
      <Navbar onSelect={setUnitySrc} />
      {renderUnityComponent()}
    </Box>
  )
}

export default Games
