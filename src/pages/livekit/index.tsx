// /src/App.js
import React, { useState, useEffect } from 'react'
import RoomStage from './RoomStage'
import { Box, Typography } from '@mui/material'

function App() {
  const [identity, setIdentity] = useState('')
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const room = 'demo'

  useEffect(() => {
    // Generar identity al montar el componente
    const newIdentity = `user_${Math.floor(Math.random() * 10000)}`
    setIdentity(newIdentity)
  }, [])

  useEffect(() => {
    if (identity) {
      setIsLoading(true) // Activar el estado de carga antes de la solicitud
      fetch(`https://futuraspaceserver4.link:3006/get-token?room=${room.toString()}&identity=${identity.toString()}`)
        .then(response => response.json())
        .then(data => {
          console.log('>> Token recibido:' + data.dataToken)
          setToken(data.dataToken)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error fetching token:', error)
          setIsLoading(false)
        })
    }
  }, [identity])

  if (isLoading) {
    return (
      <Box sx={{ backgroundColor: 'black' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
  <Box display='flex' height='100%' flexDirection='column' justifyContent='center' alignItems='center' pt={4}>
  <RoomStage token={token} />
  </Box>);
}

export default App
