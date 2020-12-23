import { useCallback, useContext, UIEvent, useEffect, useRef } from 'react';

import { Track } from 'components/Track/Track';
import { default as Styles } from 'components/Playlist/Playlist.module.css';
import { PlayerContext } from 'components/PlayerContext/PlayerContext';
import { useQueryParam } from 'hocs/useQueryParam';

export function Playlist() {
  const playlistRef = useRef<HTMLDivElement>(null);
  const { tracks, changeTrack, currentTrack } = useContext(PlayerContext)
  const [ currentTrackNumber, setCurrentTrackNumber ] = useQueryParam('track');

  const onClick = useCallback((order: number) => {
    changeTrack(tracks.find(track => track.order === order));
  }, [changeTrack, tracks]);

  const onScroll = useCallback((evt: UIEvent<HTMLDivElement>) => {
    if (!evt.currentTarget) {
      return;
    }

    const leftValue = evt.currentTarget.scrollLeft / evt.currentTarget.clientWidth;
    const topValue = evt.currentTarget.scrollTop / evt.currentTarget.clientHeight;

    if (!Number.isInteger(leftValue) || !Number.isInteger(topValue)) {
      return;
    }

    setCurrentTrackNumber(Math.max(leftValue, topValue).toString());
  }, []);

  useEffect(() => {
    if (!playlistRef.current) {
      return;
    }

    playlistRef.current.scrollTo({
      top: playlistRef.current.clientHeight * Number.parseInt(currentTrackNumber || '0'),
      left: playlistRef.current.clientWidth * Number.parseInt(currentTrackNumber || '0')
    })
  }, [currentTrackNumber]);

  return (
    <div className={Styles.Playlist} onScroll={onScroll} ref={playlistRef}>
      {tracks.map(track => (
        <Track key={track.order} track={track} onClick={onClick} isCurrent={currentTrack?.order === track.order} />
      ))}
    </div>
  );
}