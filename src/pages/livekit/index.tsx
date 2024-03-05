// /src/App.js
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import RoomComponent from './roomComponent'
import Box from '@mui/material/Box'

function App() {
  const token = 'UUVJwMVQ9yZstQ5sj3gMC0UnjAAGhRhcAwu/Cy6OV7U='
  const url = 'wss://futuraspaceserver4.link/WebLivekitTest/'

  return (
    <div className='App' style={{ height: '100vh', width: '100%' }}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <RoomComponent url={url} token={token} />
      </Box>
    </div>
  )
}

export default App
