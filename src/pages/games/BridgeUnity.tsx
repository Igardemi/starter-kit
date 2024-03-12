import React, { useEffect, useState, useRef  } from 'react'
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
  const iframeRef = useRef<HTMLIFrameElement>(null); 

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFullScreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).mozRequestFullScreen) { // Firefox
        (iframe as any).mozRequestFullScreen();
      } else if ((iframe as any).webkitRequestFullscreen) { // Chrome, Safari & Opera
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).msRequestFullscreen) { // IE/Edge
        (iframe as any).msRequestFullscreen();
      }
    }
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
      if (event.data && event.data.action === 'FullScreen') {
        handleFullScreen()
      }
    }

    window.addEventListener('message', handleMensaje)

    return () => {
      window.removeEventListener('message', handleMensaje)
    }
  }, [])

  return (
    <Box display='flex' height='100%' flexDirection='column' justifyContent='start' alignContent='start' alignItems='start'>
       <IconButton  sx={{position:'relative', top:'50px', left:'0px', fontSize:'26px', color:'white'}}
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
        >
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
      ref={iframeRef}
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
