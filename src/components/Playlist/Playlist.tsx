import { useCallback, useContext } from 'react';

import { Track } from 'components/Track/Track';
import { default as Styles } from 'components/Playlist/Playlist.module.css';
import { PlayerContext } from 'components/PlayerContext/PlayerContext';

export function Playlist() {
  const { tracks, changeTrack, currentTrack } = useContext(PlayerContext)

  const onClick = useCallback((order: number) => {
    changeTrack(tracks.find(track => track.order === order));
  }, [changeTrack, tracks]);

  return (
    <div className={Styles.Playlist}>
      {tracks.map(track => (
        <Track key={track.order} track={track} onClick={onClick} isCurrent={currentTrack?.order === track.order} />
      ))}
    </div>
  );
}