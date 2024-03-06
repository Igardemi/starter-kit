// /src/UnityCanvas.tsx
import React, { useEffect, useState } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import { Grid, Button, CircularProgress, Box } from '@mui/material'

// ** Next Import
import { useRouter } from 'next/router'

const BridgeUnity = () => {
  const [src, setSrc] = useState(
    'https://futuraspaceserver4.link/mini_games/bridge_game_client/Build/bridge_game_client'
  )

  const [config, setConfig] = useState({
    loaderUrl: `${src}.loader.js`,
    dataUrl: `${src}.data`,
    frameworkUrl: `${src}.framework.js`,
    codeUrl: `${src}.wasm`
  })

  const [isConfigured, setIsConfigured] = useState(false)
  const { unityProvider, loadingProgression, isLoaded, unload, requestFullscreen } = useUnityContext(config)
  const router = useRouter()

  //comprobar si es valido el src
  const isValidSrc = (src: string) => {
    if (!src) return false

    const pattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i'
    )

    return !!pattern.test(src)
  }

  useEffect(() => {
    const updateConfig = async () => {
      if (isValidSrc(src)) {
        console.log('<<< :', src)
        setConfig({
          loaderUrl: `${src}.loader.js`,
          dataUrl: `${src}.data`,
          frameworkUrl: `${src}.framework.js`,
          codeUrl: `${src}.wasm`
        })
        setIsConfigured(true)
      }
    }
    updateConfig().catch(console.error)

    return () => {
      async function cleanup() {
        try {
          await unload()
        } catch (error) {
          console.error('Error al desmontar Unity:', error)
        }
      }

      console.log('>> Desmontando Unity...')
      cleanup()
      console.log('>> Unity desmontado.')
    }
  }, [src])

  useEffect(() => {
    const handleMensaje = async (event: MessageEvent) => {
      console.log('Mensaje recibido:', event.data)
      if (event.data && event.data.action === 'BackToMainFrame') {
      }
    }

    window.addEventListener('message', handleMensaje)

    return () => {
      window.removeEventListener('message', handleMensaje)
    }
  }, [])

  async function handleClickBack() {
    try {
      try {
        await unload()
      } catch (error) {
        console.error('Error al desmontar Unity:', error)
      }
      router.replace('/')
    } catch (error) {
      console.error('Error al desmontar Unity:', error)
    }
  }

  function handleClickEnterFullscreen() {
    requestFullscreen(true)
  }

  return (
    <Box sx={{ width: '100%', p: 2, backgroundColor: 'lightgrey' }}>
      {loadingProgression < 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
          <CircularProgress variant='determinate' value={loadingProgression * 100} />
          <Box>Loading Application... {Math.round(loadingProgression * 100)}%</Box>
        </Box>
      )}
      <Unity
        id='unitybridge'
        unityProvider={unityProvider}
        style={{
          visibility: isLoaded ? 'visible' : 'hidden',
          height: 600,
          width: '100%'
        }}
      />
      <Grid container spacing={2} justifyContent='center'>
        <Grid item>
          <Button variant='contained' onClick={handleClickBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button variant='contained' onClick={handleClickEnterFullscreen}>
            Enter Fullscreen
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BridgeUnity
