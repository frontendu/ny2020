import { default as Data } from 'data/playlist.json';
import { useCallback, useRef } from 'react';

import { TrackDto } from 'dto/Track';
import { Track } from 'components/Track/Track';
import { default as Styles } from 'components/Playlist/Playlist.module.css';

const Tracks: TrackDto[] = Data;

export function Playlist() {
  const audio = useRef(new Audio);

  const onClick = useCallback((url: string) => {
    if (!audio.current.paused) {
      audio.current.pause();
    }

    audio.current = Object.assign(new Audio(), {
      src: url
    });

    audio.current.play();
  }, []);

  return (
    <div className={Styles.Playlist}>
      {Tracks.map(track => (
        <Track key={track.order} track={track} onClick={onClick} />
      ))}
    </div>
  );
}