import React, { useEffect } from 'react'
import { LiveKitRoom, StageView, useRoom } from '@livekit/react-components'
import Box from '@mui/material/Box'
import '@livekit/react-components/dist/index.css'

// Define las props que espera recibir el componente
interface RoomComponentProps {
  token: string
  url: string
}

const RoomComponent: React.FC<RoomComponentProps> = ({ token, url }) => {
  const { connect, isConnecting } = useRoom()

  useEffect(() => {
    if (token) {
      connect(url, token).catch(console.error)
    }
  }, [connect, token, url])

  if (isConnecting) {
    return <div>Conectando a la sala...</div>
  }

  return (
    <Box>
      <LiveKitRoom url={url} token={token}></LiveKitRoom>
    </Box>
  )
}

export default RoomComponent
