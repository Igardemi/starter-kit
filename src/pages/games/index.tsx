// /src/App.js
import React, { useState } from 'react'
import MyNavbar from './NavBar'
import UnityCanvas from './UnityCanvas'
import Box from '@mui/material/Box'
import WindowWrapper from 'src/@core/components/window-wrapper'

function Games() {
  const [unitySrc, setUnitySrc] = useState('')

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <MyNavbar setUnitySrc={setUnitySrc} />
      <WindowWrapper>{unitySrc !== '' && <UnityCanvas src={unitySrc} />}</WindowWrapper>
    </Box>
  )
}

export default Games
