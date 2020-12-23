import { useCallback, useContext } from 'react';

import { default as Styles } from 'components/Player/Player.module.css';
import { PlayerContext } from 'components/PlayerContext/PlayerContext';

export function Player() {
  const {
    isPlayed,
    playbackRate, 
    toggle,
    currentTrack,
    increasePlaybackRate
  } = useContext(PlayerContext);
  const onClickControl = useCallback(() => {
    toggle();
  }, [toggle, isPlayed]);

  if (!currentTrack) {
    return null;
  }

  const { backgroundColor, playColor } = currentTrack;

  return (
    <div className={Styles.Player} style={{ backgroundColor, color: playColor }}>
      <div 
        className={[Styles.Player__Control, isPlayed && Styles.Player__Control_Pause].join(' ')}
        style={{ borderColor: `transparent transparent transparent ${playColor}`}}
        onClick={onClickControl}
      />
      <div className={Styles.Player__Rate} onClick={increasePlaybackRate}>x{playbackRate}</div>
    </div>
  );
}