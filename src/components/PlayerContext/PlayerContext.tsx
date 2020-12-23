import { createContext, useCallback, useRef, useState, PropsWithChildren, useEffect } from 'react';

import { default as Data } from 'data/playlist.json';
import { TrackDto } from 'dto/Track';
import { generateColor } from 'generateColor';

const Tracks: TrackDto[] = Data;

export type TrackEntity = TrackDto & {
  backgroundColor: string;
  playColor: string;
  greetingColor: string;
}

type PlayerContextEntity = {
  tracks: TrackEntity[];
  currentTrack: TrackEntity | null;
  currentTime: number;
  currentEndTime: number;
  changeTrack: (track?: TrackEntity) => void;
  isPlayed: boolean;
  playbackRate: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  increasePlaybackRate: () => void;
  changeCurrentTime: (newValue: number) => void;
};

const noop = () => void 0;

export const PlayerContext = createContext<PlayerContextEntity>({
  tracks: [],
  currentTrack: null,
  currentTime: 0,
  currentEndTime: 0,
  isPlayed: false,
  playbackRate: 1,
  changeTrack: noop,
  play: noop,
  pause: noop,
  toggle: noop,
  increasePlaybackRate: noop,
  changeCurrentTime: noop
});

const PLAYBACK_RATES = [
  1,
  1.25,
  1.5,
  1.75,
  2
];

export const PlayerProvider = ({children}: PropsWithChildren<{}>) => {
  const audio = useRef(new Audio);
  const idxTimer = useRef<number>(-1);
  const [tracks] = useState(Tracks.map(track => ({
    ...track,
    backgroundColor: generateColor(),
    playColor: generateColor(),
    greetingColor: generateColor()
  })));
  const [currentTime, setCurrentTime] = useState(0);
  const [currentEndTime, setCurrentEndTime] = useState(0);
  const [isPlayed, setIsPlayed] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTrack, setCurrentTrack] = useState<TrackEntity | null>(null);

  useEffect(() => {
    if (!isPlayed) {
      return;
    };

    if (idxTimer.current !== -1) {
      clearInterval(idxTimer.current);
    }

    // @ts-ignore
    idxTimer.current = setInterval(() => {
      setCurrentTime(audio.current.currentTime);
    }, 200);

    return () => clearInterval(idxTimer.current);
  }, [isPlayed]);

  const onLoadMetadata = useCallback(() => {
    setCurrentEndTime(audio.current.duration)
  }, []);

  useEffect(() => {
    const { current } = audio;

    current.addEventListener('loadedmetadata', onLoadMetadata);
    return () => current.removeEventListener('loadedmetadata', onLoadMetadata);
  }, [audio.current])

  const increasePlaybackRate = useCallback(() => {
    const newPlaybackRate = [...PLAYBACK_RATES].splice(
      PLAYBACK_RATES.findIndex(rate => rate === playbackRate) - PLAYBACK_RATES.length + 1,
      1
    )[0];

    setPlaybackRate(newPlaybackRate);
    audio.current.playbackRate = newPlaybackRate;
  }, [playbackRate]);

  const play = useCallback(() => {
    audio.current.play();
    setIsPlayed(true);
  }, [isPlayed, setIsPlayed]);

  const pause = useCallback(() => {
    audio.current.pause();
    setIsPlayed(false);
  }, [isPlayed, setIsPlayed]);

  const toggle = useCallback(() => {
    isPlayed ? pause() : play(); 
  }, [isPlayed, pause, play]);

  const changeTrack = useCallback((track?: TrackEntity) => {
    if (!track) {
      return;
    }

    setCurrentTrack(track);
    pause();

    audio.current = Object.assign(new Audio(), {
      src: track.url,
      playbackRate,
      preload: true
    });

    play();
  }, [isPlayed, setCurrentTrack, play, pause]);

  const changeCurrentTime = useCallback((currentTime: number) => {
    audio.current.currentTime = currentTime;
    play();
  }, [])

  return (
    <PlayerContext.Provider value={{
      tracks,
      currentTrack,
      currentTime,
      currentEndTime,
      isPlayed,
      playbackRate,
      changeTrack,
      pause,
      play,
      toggle,
      increasePlaybackRate,
      changeCurrentTime
    }}>
      {children}
    </PlayerContext.Provider>
  );
}