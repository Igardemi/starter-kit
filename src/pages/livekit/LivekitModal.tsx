// /src/App.js
import React, { useState, useEffect } from 'react'
import RoomStage from './RoomStage'
import '@livekit/components-styles';

// store
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import ModalDraggable from 'src/pages/livekit/ModalDraggable';

function LivekitModal() {
  const tokenLivekit = useSelector((state: RootState) => state.livekit.tokenLivekit);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {

   tokenLivekit?handleOpen():handleClose()
    
  }, [tokenLivekit])


    return (
        <ModalDraggable isOpen={open} handleClose={handleClose} title="Videocall">
        <RoomStage />
        </ModalDraggable>   
    );
}

export default LivekitModal
