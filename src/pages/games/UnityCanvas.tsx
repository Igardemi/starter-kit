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
    loaderUrl: '',
    dataUrl: '',
    frameworkUrl: '',
    codeUrl: ''
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
      // Crear una función asíncrona dentro de la función de limpieza
      const cleanUpAsync = async () => {
        await handleClickBack() // Asegúrate de que esta función espera a que Unity se desmonte completamente
        console.log('Unity desmontado correctamente')
      }

      // Llamar a la función asíncrona
      cleanUpAsync()
    }
  }, [src])

  async function handleClickBack() {
    try {
      console.log('>> Vamos a desmontar Unity')
      await unload()
      console.log('>> Unity desmontado')
      setIsConfigured(false)
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
