import type {
    CreateLocalTracksOptions,
    LocalAudioTrack,
    LocalTrack,
    LocalVideoTrack,
  } from 'livekit-client';
  import {
    createLocalAudioTrack,
    createLocalTracks,
    createLocalVideoTrack,
    facingModeFromLocalTrack,
    Track,
    VideoPresets,
  } from 'livekit-client';
  import * as React from 'react';
  import { log } from '@livekit/components-core';
  import { MediaDeviceMenu, ParticipantPlaceholder, TrackToggle, useMediaDevices, usePersistentUserChoices } from '@livekit/components-react';

  const defaultUserChoices: LocalUserChoices = {
    videoEnabled: true,
    audioEnabled: true,
    videoDeviceId: '',
    audioDeviceId: '',
  } as const;
  
  export type LocalUserChoices = {
    /**
     * Whether video input is enabled.
     * @defaultValue `true`
     */
    videoEnabled: boolean;
    /**
     * Whether audio input is enabled.
     * @defaultValue `true`
     */
    audioEnabled: boolean;
    /**
     * The device ID of the video input device to use.
     * @defaultValue `''`
     */
    videoDeviceId: string;
    /**
     * The device ID of the audio input device to use.
     * @defaultValue `''`
     */
    audioDeviceId: string;
  };

  /**
   * Props for the PreJoin component.
   * @public
   */
  export interface PreJoinProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit' | 'onError'> {
    /** This function is called with the `LocalUserChoices` if validation is passed. */
    onSubmit?: (values: LocalUserChoices) => void;
    /**
     * Provide your custom validation function. Only if validation is successful the user choices are past to the onSubmit callback.
     */
    onValidate?: (values: LocalUserChoices) => boolean;
    onError?: (error: Error) => void;
    /** Prefill the input form with initial values. */
    defaults?: Partial<LocalUserChoices>;
    /** Display a debug window for your convenience. */
    debug?: boolean;
    joinLabel?: string;
    micLabel?: string;
    camLabel?: string;
    /**
     * If true, user choices are persisted across sessions.
     * @defaultValue true
     * @alpha
     */
    persistUserChoices?: boolean;
  }
  
  /** @alpha */
  export function usePreviewTracks(
    options: CreateLocalTracksOptions,
    onError?: (err: Error) => void,
  ) {
    const [tracks, setTracks] = React.useState<LocalTrack[]>();
  
    React.useEffect(() => {
      let trackPromise: Promise<LocalTrack[]> | undefined = undefined;
      let needsCleanup = false;
      if (options.audio || options.video) {
        trackPromise = createLocalTracks(options);
        trackPromise
          .then((tracks) => {
            if (needsCleanup) {
              tracks.forEach((tr) => tr.stop());
            } else {
              setTracks(tracks);
            }
          })
          .catch(onError);
      }
  
      return () => {
        needsCleanup = true;
        trackPromise?.then((tracks) =>
          tracks.forEach((track) => {
            track.stop();
          }),
        );
      };
    }, [JSON.stringify(options)]);
  
    return tracks;
  }
  
  /** @public */
  export function usePreviewDevice<T extends LocalVideoTrack | LocalAudioTrack>(
    enabled: boolean,
    deviceId: string,
    kind: 'videoinput' | 'audioinput',
  ) {
    const [deviceError, setDeviceError] = React.useState<Error | null>(null);
    const [isCreatingTrack, setIsCreatingTrack] = React.useState<boolean>(false);
  
    const devices = useMediaDevices({ kind });
    const [selectedDevice, setSelectedDevice] = React.useState<MediaDeviceInfo | undefined>(
      undefined,
    );
  
    const [localTrack, setLocalTrack] = React.useState<T>();
    const [localDeviceId, setLocalDeviceId] = React.useState<string>(deviceId);
  
    React.useEffect(() => {
      setLocalDeviceId(deviceId);
    }, [deviceId]);
  
    const createTrack = async (deviceId: string, kind: 'videoinput' | 'audioinput') => {
      try {
        const track =
          kind === 'videoinput'
            ? await createLocalVideoTrack({
                deviceId: deviceId,
                resolution: VideoPresets.h720.resolution,
              })
            : await createLocalAudioTrack({ deviceId });
  
        const newDeviceId = await track.getDeviceId();
        if (newDeviceId && deviceId !== newDeviceId) {
          prevDeviceId.current = newDeviceId;
          setLocalDeviceId(newDeviceId);
        }
        setLocalTrack(track as T);
      } catch (e) {
        if (e instanceof Error) {
          setDeviceError(e);
        }
      }
    };
  
    const switchDevice = async (track: LocalVideoTrack | LocalAudioTrack, id: string) => {
      await track.setDeviceId(id);
      prevDeviceId.current = id;
    };
  
    const prevDeviceId = React.useRef(localDeviceId);
  
    React.useEffect(() => {
      if (enabled && !localTrack && !deviceError && !isCreatingTrack) {
        log.debug('creating track', kind);
        setIsCreatingTrack(true);
        createTrack(localDeviceId, kind).finally(() => {
          setIsCreatingTrack(false);
        });
      }
    }, [enabled, localTrack, deviceError, isCreatingTrack]);
  
    // switch camera device
    React.useEffect(() => {
      if (!localTrack) {
        return;
      }
      if (!enabled) {
        log.debug(`muting ${kind} track`);
        localTrack.mute().then(() => log.debug(localTrack.mediaStreamTrack));
      } else if (selectedDevice?.deviceId && prevDeviceId.current !== selectedDevice?.deviceId) {
        log.debug(`switching ${kind} device from`, prevDeviceId.current, selectedDevice.deviceId);
        switchDevice(localTrack, selectedDevice.deviceId);
      } else {
        log.debug(`unmuting local ${kind} track`);
        localTrack.unmute();
      }
    }, [localTrack, selectedDevice, enabled, kind]);
  
    React.useEffect(() => {
      return () => {
        if (localTrack) {
          log.debug(`stopping local ${kind} track`);
          localTrack.stop();
          localTrack.mute();
        }
      };
    }, []);
  
    React.useEffect(() => {
      setSelectedDevice(devices?.find((dev) => dev.deviceId === localDeviceId));
    }, [localDeviceId, devices]);
  
    return {
      selectedDevice,
      localTrack,
      deviceError,
    };
  }
  
  /**
   * The `PreJoin` prefab component is normally presented to the user before he enters a room.
   * This component allows the user to check and select the preferred media device (camera und microphone).
   * On submit the user decisions are returned, which can then be passed on to the `LiveKitRoom` so that the user enters the room with the correct media devices.
   *
   * @remarks
   * This component is independent of the `LiveKitRoom` component and should not be nested within it.
   * Because it only access the local media tracks this component is self contained and works without connection to the LiveKit server.
   *
   * @example
   * ```tsx
   * <PreJoin />
   * ```
   * @public
   */
  export function PreJoin({
    defaults = {},
    onValidate,
    onSubmit,
    onError,
    debug,
    joinLabel = 'Enter Room',
    micLabel = 'Microphone',
    camLabel = 'Camera',
    persistUserChoices = true,
    ...htmlProps
  }: PreJoinProps) {
    const [userChoices, setUserChoices] = React.useState(defaultUserChoices);
  
    // TODO: Remove and pipe `defaults` object directly into `usePersistentUserChoices` once we fully switch from type `LocalUserChoices` to `UserChoices`.
    const partialDefaults: Partial<LocalUserChoices> = {
      ...(defaults.audioDeviceId !== undefined && { audioDeviceId: defaults.audioDeviceId }),
      ...(defaults.videoDeviceId !== undefined && { videoDeviceId: defaults.videoDeviceId }),
      ...(defaults.audioEnabled !== undefined && { audioEnabled: defaults.audioEnabled }),
      ...(defaults.videoEnabled !== undefined && { videoEnabled: defaults.videoEnabled }),
    };
  
    const {
      userChoices: initialUserChoices,
      saveAudioInputDeviceId,
      saveAudioInputEnabled,
      saveVideoInputDeviceId,
      saveVideoInputEnabled,
    } = usePersistentUserChoices({
      defaults: partialDefaults,
      preventSave: !persistUserChoices,
      preventLoad: !persistUserChoices,
    });
  
    // Initialize device settings
    const [audioEnabled, setAudioEnabled] = React.useState<boolean>(initialUserChoices.audioEnabled);
    const [videoEnabled, setVideoEnabled] = React.useState<boolean>(initialUserChoices.videoEnabled);
    const [audioDeviceId, setAudioDeviceId] = React.useState<string>(
      initialUserChoices.audioDeviceId,
    );
    const [videoDeviceId, setVideoDeviceId] = React.useState<string>(
      initialUserChoices.videoDeviceId,
    );
  
    // Save user choices to persistent storage.
    React.useEffect(() => {
      saveAudioInputEnabled(audioEnabled);
    }, [audioEnabled, saveAudioInputEnabled]);
    React.useEffect(() => {
      saveVideoInputEnabled(videoEnabled);
    }, [videoEnabled, saveVideoInputEnabled]);
    React.useEffect(() => {
      saveAudioInputDeviceId(audioDeviceId);
    }, [audioDeviceId, saveAudioInputDeviceId]);
    React.useEffect(() => {
      saveVideoInputDeviceId(videoDeviceId);
    }, [videoDeviceId, saveVideoInputDeviceId]);
  
    const tracks = usePreviewTracks(
      {
        audio: audioEnabled ? { deviceId: initialUserChoices.audioDeviceId } : false,
        video: videoEnabled ? { deviceId: initialUserChoices.videoDeviceId } : false,
      },
      onError,
    );
  
    const videoEl = React.useRef(null);
  
    const videoTrack = React.useMemo(
      () => tracks?.filter((track) => track.kind === Track.Kind.Video)[0] as LocalVideoTrack,
      [tracks],
    );
  
    const facingMode = React.useMemo(() => {
      if (videoTrack) {
        const { facingMode } = facingModeFromLocalTrack(videoTrack);
        return facingMode;
      } else {
        return 'undefined';
      }
    }, [videoTrack]);
  
    const audioTrack = React.useMemo(
      () => tracks?.filter((track) => track.kind === Track.Kind.Audio)[0] as LocalAudioTrack,
      [tracks],
    );
  
    React.useEffect(() => {
      if (videoEl.current && videoTrack) {
        videoTrack.unmute();
        videoTrack.attach(videoEl.current);
      }
  
      return () => {
        videoTrack?.detach();
      };
    }, [videoTrack]);
  
    React.useEffect(() => {
      const newUserChoices = {
        videoEnabled,
        videoDeviceId,
        audioEnabled,
        audioDeviceId,
      };
      setUserChoices(newUserChoices);
    }, [ videoEnabled, audioEnabled, audioDeviceId, videoDeviceId]);
  
    function handleSubmit(event: React.FormEvent) {
      event.preventDefault();
      if (typeof onSubmit === 'function') {
          onSubmit(userChoices);
      } else {
        log.warn('Validation failed with: ', userChoices);
      }
    }
  
    useWarnAboutMissingStyles();
  
    return (
      <div >
        <div >
          {videoTrack && (
            <video ref={videoEl} width="1280" height="720" data-lk-facing-mode={facingMode} />
          )}
          {(!videoTrack || !videoEnabled) && (
            <div >
              <ParticipantPlaceholder />
            </div>
          )}
        </div>
        <div >
          <div >
            <TrackToggle
              initialState={audioEnabled}
              source={Track.Source.Microphone}
              onChange={(enabled) => setAudioEnabled(enabled)}
            >
              {micLabel}
            </TrackToggle>
            <div >
              <MediaDeviceMenu
                initialSelection={audioDeviceId}
                kind="audioinput"
                disabled={!audioTrack}
                tracks={{ audioinput: audioTrack }}
                onActiveDeviceChange={(_, id) => setAudioDeviceId(id)}
              />
            </div>
          </div>
          <div >
            <TrackToggle
              initialState={videoEnabled}
              source={Track.Source.Camera}
              onChange={(enabled) => setVideoEnabled(enabled)}
            >
              {camLabel}
            </TrackToggle>
            <div>
              <MediaDeviceMenu
                initialSelection={videoDeviceId}
                kind="videoinput"
                disabled={!videoTrack}
                tracks={{ videoinput: videoTrack }}
                onActiveDeviceChange={(_, id) => setVideoDeviceId(id)}
              />
            </div>
          </div>
        </div> 
  
         <button
            type="submit"
            onClick={handleSubmit}
          >
            {joinLabel}
          </button>
  
        {debug && (
          <>
            <strong>User Choices:</strong>
            <ul style={{ overflow: 'hidden', maxWidth: '15rem' }}>
              <li>Video Enabled: {`${userChoices.videoEnabled}`}</li>
              <li>Audio Enabled: {`${userChoices.audioEnabled}`}</li>
              <li>Video Device: {`${userChoices.videoDeviceId}`}</li>
              <li>Audio Device: {`${userChoices.audioDeviceId}`}</li>
            </ul>
          </>
        )}
      </div>
    );
  }

function useWarnAboutMissingStyles() {
    throw new Error('Function not implemented.');
}
  