import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

interface MensajeEvent {
  action?: string
  progress?: number
}

const PlatformUnity: React.FC = () => {
  const [progress, setProgress] = useState<number>(0)
  const [unityLoaded, setUnityLoaded] = useState<boolean>(false)

  useEffect(() => {
    const handleMensaje = (event: MessageEvent<MensajeEvent>) => {
      console.log('Mensaje recibido:', event.data)
      if (event.data && event?.data.action === 'BackToMainFrame') {
        console.log('Fin del juego')
      }
      if (event.data && event.data.action === 'LoadProgress') {
        setProgress(event.data.progress || 0)
      }
      if (event.data && event.data.action === 'UnityLoaded') {
        setUnityLoaded(true)
      }
    }

    window.addEventListener('message', handleMensaje)

    return () => {
      window.removeEventListener('message', handleMensaje)
    }
  }, [])

  return (
    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' pt={4}>
      {!unityLoaded && (
        <Box width='100%' mb={2}>
          <Box
            sx={{
              width: `${progress ? progress * 100 : 0}%`,
              backgroundColor: 'green',
              height: '20px',
              transition: 'width .5s ease-in-out'
            }}
          ></Box>
        </Box>
      )}
      <iframe
        title='frame-platform'
        src='https://futuraspaceserver4.link/mini_games/platform_game_client/index.html'
        width='900'
        height='600'
        scrolling='no'
      ></iframe>
    </Box>
  )
}

export default PlatformUnity
