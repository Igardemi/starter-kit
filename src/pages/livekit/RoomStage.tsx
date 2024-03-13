'use client';
import {
  LiveKitRoom,
  VideoConference,
  formatChatMessageLinks,
  LocalUserChoices,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Box } from '@mui/material';
import {
  Room,
  RoomConnectOptions
} from 'livekit-client';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';

// store
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface RoomStageProps {
  username: string
}

const RoomStage: NextPage<RoomStageProps> = ({ username}) => {
  const router = useRouter();
  const roomName: string = "demo";
  const tokenLivekit = useSelector((state: RootState) => state.livekit.tokenLivekit);

  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(
    {
      videoEnabled: false,
      audioEnabled: true,
      videoDeviceId: "",
      audioDeviceId: "",
      username: username,
  }
  );

  return (
      <Box sx={{display:'flex', justifyContent:'center',mt:10}}>
        {tokenLivekit && roomName && !Array.isArray(roomName) && preJoinChoices ? (
          <ActiveRoom
            roomName={roomName}
            token = {tokenLivekit}
            userChoices={preJoinChoices}
            onLeave={() => {
              router.push('/');
            }}
          ></ActiveRoom>
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            No funciona!
            {tokenLivekit}
          </div>
        )}
      </Box>
  );
};

export default RoomStage;

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomName: string;
  token: string;
  region?: string;
  onLeave?: () => void;
};
const ActiveRoom = ({ token, userChoices, onLeave }: ActiveRoomProps) => {
  
  const liveKitUrl = "wss://futuraspaceserver12.link";

  const room = React.useMemo(() => new Room(), []);

  const connectOptions = React.useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);

  return (
    <>
      {liveKitUrl && (
        <LiveKitRoom
          room={room}
          token={token}
          serverUrl={liveKitUrl}
          connectOptions={connectOptions}
          video={userChoices.videoEnabled}
          audio={userChoices.audioEnabled}
          onDisconnected={onLeave}
        >
          <VideoConference
            chatMessageFormatter={formatChatMessageLinks}
          />
        </LiveKitRoom>
      )}
    </>
  );
};