import React from 'react'
import '@livekit/components-styles'
import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'

interface RoomStageProps {
  token: string
}

const RoomStage: React.FC<RoomStageProps> = ({ token }) => {
  if (!token || token === '') {
    return (
      <div className='valign-wrapper' style={{ backgroundColor: 'black', height: '100vh', width: '100vw' }}>
        <h2 className='white-text center-align'>Receiving Token Livekit</h2>
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

export default RoomStage
