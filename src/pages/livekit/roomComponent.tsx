import React from 'react'
import '@livekit/components-styles'
import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'

// Define las props que espera recibir el componente
interface RoomComponentProps {
  token: string
}

const RoomComponent: React.FC<RoomComponentProps> = ({ token }) => {
  if (!token || token === '') {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{ backgroundColor: 'black' }}>
        <h2 className='text-white'>Reiciving Token Livekit</h2>
      </div>
    )
  }

  return (
    <LiveKitRoom video={true} audio={true} token={token} serverUrl={'wss://futuraspaceserver12.link'} connect={true}>
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  )
}

export default RoomComponent
