// /src/App.js
import React, { useState, useEffect } from 'react'
import RoomStage from './RoomStage'
import { Box, Typography } from '@mui/material'
import '@livekit/components-styles';
import { useDispatch } from 'react-redux';
import { setTokenLivekit } from '../../store/slices/livekitSlice'; 

function livekitToken() {
  const [identity, setIdentity] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const room = 'demo'
  const dispatch = useDispatch();

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
          saveToken(data.dataToken) //almacenamos en el store de redux el token
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error fetching token:', error)
          setIsLoading(false)
        })
    }
  }, [identity])
 
    const saveToken = (token: string) => {
      dispatch(setTokenLivekit(token));
    };

  if (isLoading) {
    return (
      <Box sx={{display:'flex', justifyContent:'center',mt:10}}>
        <Typography >Loading...</Typography>
        </Box>
    )
  }

  return (
    <Box sx={{display:'flex', alignContent:'center', justifyContent:'center', mt:20}}>
      <RoomStage username={identity} />
      </Box>
);
}

export default livekitToken
