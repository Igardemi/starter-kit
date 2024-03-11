'use client';
import {
  LiveKitRoom,
  VideoConference,
  formatChatMessageLinks,
  LocalUserChoices,
} from '@livekit/components-react';
import { Box } from '@mui/material';
import {
  Room,
  RoomConnectOptions
} from 'livekit-client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';

const PreJoinNoSSR = dynamic(
  async () => {
    return (await import('@livekit/components-react')).PreJoin;
  },
  { ssr: false },
);

interface RoomStageProps {
  token: string
}

const RoomStage: NextPage<RoomStageProps> = ({ token }) => {
  const router = useRouter();
  const roomName: string = "demo";

  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(
    undefined,
  );

  function handlePreJoinSubmit(values: LocalUserChoices) {
    setPreJoinChoices(values);
  }
  return (
      <Box sx={{backgroundColor:'black'}}>
        {roomName && !Array.isArray(roomName) && preJoinChoices ? (
          <ActiveRoom
            roomName={roomName}
            token = {token}
            userChoices={preJoinChoices}
            onLeave={() => {
              router.push('/');
            }}
          ></ActiveRoom>
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <PreJoinNoSSR
              onError={(err) => console.log('error while setting up prejoin', err)}
              defaults={{
                videoEnabled: true,
                audioEnabled: true,
              }}
              onSubmit={handlePreJoinSubmit}
            ></PreJoinNoSSR>
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