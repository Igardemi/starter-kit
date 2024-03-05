// /src/App.js
import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import MyNavbar from './NavBar'
import UnityCanvas from './UnityCanvas'
import Box from '@mui/material/Box'

function App() {
  const [unitySrc, setUnitySrc] = useState('')

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <MyNavbar setUnitySrc={setUnitySrc} />
      <UnityCanvas src={unitySrc} />
    </Box>
  )
}

export default App
