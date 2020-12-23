import { useCallback, useContext, UIEvent, useEffect, useRef } from 'react';

import { Track } from 'components/Track/Track';
import { default as Styles } from 'components/Playlist/Playlist.module.css';
import { PlayerContext } from 'components/PlayerContext/PlayerContext';
import { useQueryParam } from 'hocs/useQueryParam';

export function Playlist() {
  const playlistRef = useRef<HTMLDivElement>(null);
  const { tracks, changeTrack, currentTrack, isPlayed } = useContext(PlayerContext)
  const [ locationTrack ] = useQueryParam('track');

  const onClick = useCallback((order: number) => {
    changeTrack(tracks.find(track => track.order === order));
  }, [changeTrack, tracks]);

  useEffect(() => {
    if (!playlistRef.current) {
      return;
    }

    playlistRef.current.scrollTo({
      top: playlistRef.current.clientHeight * Number.parseInt(locationTrack || '0'),
      left: playlistRef.current.clientWidth * Number.parseInt(locationTrack || '0')
    })
  }, [locationTrack]);

  return (
    <div className={Styles.Playlist} ref={playlistRef}>
      {tracks.map(track => (
        <Track key={track.order} track={track} onClick={onClick} isCurrent={currentTrack?.order === track.order} />
      ))}
    </div>
  );
}