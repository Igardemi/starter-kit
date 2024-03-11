import React, { useEffect, useState } from 'react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material';

interface MensajeEvent {
  action?: string
  progress?: number
}

const BridgeUnity: React.FC = () => {
  const [progress, setProgress] = useState<number>(0)
  const [unityLoaded, setUnityLoaded] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


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
    <Box display='flex' height='100%' flexDirection='column' justifyContent='center' alignItems='center' pt={4}>
       <IconButton  sx={{display:'absolute', top:'46px', left:'-420px', fontSize:'26px', color:'white'}}
          aria-label="más opciones"
          aria-controls="long-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Menu
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '20ch',
            },
          }}
        >
          {/* Aquí se añaden las opciones del menú */}
          <MenuItem onClick={handleClose}>Opción 1</MenuItem>
          <MenuItem onClick={handleClose}>Opción 2</MenuItem>
          <MenuItem onClick={handleClose}>Opción 3</MenuItem>
        </Menu>
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
        src='https://futuraspaceserver4.link/mini_games/bridge_game_client/index.html'
        width='960'
        height='640'
        scrolling='no'
      ></iframe>
    </Box>
  )
}

export default BridgeUnity
