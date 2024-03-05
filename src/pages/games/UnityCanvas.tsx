// /src/UnityCanvas.tsx
import React, { useEffect, useState, Fragment } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import { Grid, Button, CircularProgress, Box } from '@mui/material'

// ** Next Import
import { useRouter } from 'next/router'

interface UnityCanvasProps {
  src: string
}

const UnityCanvas: React.FC<UnityCanvasProps> = ({ src }) => {
  const [config, setConfig] = useState({
    loaderUrl: ``,
    dataUrl: ``,
    frameworkUrl: ``,
    codeUrl: ``
  })
  const [isConfigured, setIsConfigured] = useState(false)
  const { unityProvider, loadingProgression, isLoaded, unload, requestFullscreen } = useUnityContext(config)
  const router = useRouter()

  useEffect(() => {
    const updateConfig = async () => {
      if (isConfigured) {
        console.log('>> Existe un unity montado')
        await handleClickBack()
        setIsConfigured(false)
      }
      if (!isConfigured && src !== '') {
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
  }, [src, isConfigured, router])

  useEffect(() => {
    const handleMensaje = (event: MessageEvent) => {
      console.log('Mensaje recibido:', event.data)
      if (event.data && event.data.action === 'BackToMainFrame') {
        handleClickBack().then(() => router.push('/'))
      }
    }

    window.addEventListener('message', handleMensaje)

    return () => {
      window.removeEventListener('message', handleMensaje)
    }
  }, [router])

  async function handleClickBack() {
    try {
      console.log('>> Vamos a desmontar Unity')
      setConfig({
        loaderUrl: '',
        dataUrl: '',
        frameworkUrl: '',
        codeUrl: ''
      })
      setIsConfigured(false)
      await unload()
      console.log('>> Unity desmontado')
    } catch (error) {
      console.error('Error al descargar el juego Unity:', error)
    }
  }

  function handleClickEnterFullscreen() {
    requestFullscreen(true)
  }

  return (
    <Fragment>
      <Box sx={{ width: '100%', p: 2, backgroundColor: 'lightgrey' }}>
        {loadingProgression < 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
            <CircularProgress variant='determinate' value={loadingProgression * 100} />
            <Box>Loading Application... {Math.round(loadingProgression * 100)}%</Box>
          </Box>
        )}
        <Unity
          unityProvider={unityProvider}
          id='my-canvas-id'
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
    </Fragment>
  )
}

export default UnityCanvas
