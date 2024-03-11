// /src/App.js
import React, { useState, useEffect, Fragment } from 'react'
import RoomStage from './RoomStage'
import { Box, Typography } from '@mui/material'
import '@livekit/components-styles';

function App() {
  const [identity, setIdentity] = useState('')
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const room = 'demo'

  useEffect(() => {
    const newIdentity = `user_${Math.floor(Math.random() * 10000)}`
    setIdentity(newIdentity)
  }, [])

  useEffect(() => {
    if (identity) {
      setIsLoading(true) // Activar el estado de carga antes de la solicitud
      fetch(`https://futuraspaceserver4.link:3006/get-token?room=${room.toString()}&identity=${identity.toString()}`)
        .then(response => response.json())
        .then(data => {
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
      <Box>
        <Typography sx={{color:'black'}}>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Fragment>
      <RoomStage token={token} username={identity} />
    </Fragment>
);
}

export default App
