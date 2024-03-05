import React from 'react'

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
    <div className='d-flex justify-content-center align-items-center' style={{ backgroundColor: 'black' }}>
      <h2 className='text-white'>{token}</h2>
    </div>
  )
}

export default RoomComponent
