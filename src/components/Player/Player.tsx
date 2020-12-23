import { useCallback, useContext, useMemo, ChangeEvent } from 'react';
import { Slider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { default as Styles } from 'components/Player/Player.module.css';
import { PlayerContext } from 'components/PlayerContext/PlayerContext';

export function Player() {
  const {
    isPlayed,
    playbackRate, 
    toggle,
    currentTrack,
    currentTime,
    currentEndTime,
    increasePlaybackRate,
    changeCurrentTime,
  } = useContext(PlayerContext);
  const onClickControl = useCallback(() => {
    toggle();
  }, [toggle, isPlayed]);

  const muiTheme = useMemo(() => createMuiTheme({
    overrides: {
      MuiSlider: {
        thumb: { color: currentTrack?.playColor },
        track: { color: currentTrack?.playColor },
        rail: { color: currentTrack?.playColor }
      }
    }
  }), [currentTrack]);

  const onChange = useCallback((_evt: ChangeEvent<{}>, newTime: number | number[]) => {
    if (Array.isArray(newTime)) {
      return;
    }

    changeCurrentTime(newTime);
  }, []);

  if (!currentTrack) {
    return null;
  }

  const { backgroundColor, playColor, length } = currentTrack;


  return (
    <div className={Styles.Player} style={{ backgroundColor, color: playColor }}>
      <div 
        className={[Styles.Player__Control, isPlayed && Styles.Player__Control_Pause].join(' ')}
        style={{ borderColor: `transparent transparent transparent ${playColor}`}}
        onClick={onClickControl}
      />
      <ThemeProvider theme={muiTheme} >
        <Slider className={Styles.Player__Slider} min={0} max={currentEndTime} onChange={onChange} value={currentTime} />
      </ThemeProvider>
      <div className={Styles.Player__Rate} onClick={increasePlaybackRate}>x{playbackRate}</div>
    </div>
  );
}