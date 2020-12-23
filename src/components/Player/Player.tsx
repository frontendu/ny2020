import { useCallback, useContext, useMemo, useState, ChangeEvent, useRef, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import ShareIcon from '@material-ui/icons/Share';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import tap from 'lodash/tap';

import { default as Styles } from 'components/Player/Player.module.css';
import { PlayerContext } from 'components/PlayerContext/PlayerContext';
import { useQueryParam } from 'hocs/useQueryParam';

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
    closeTrack,
    tracks
  } = useContext(PlayerContext);
  const [locationTrack, setLocationTrack] = useQueryParam('track');
  const shareInputRef = useRef<HTMLInputElement>(null)
  const [shareUrl, changeShareUrl] = useState<string>(() => {
    return tap(new URL(window.location.toString()), url => {
      url.searchParams.set('track', tracks.findIndex(track => track.order === currentTrack?.order).toString());
      url.searchParams.set('currentTime', '');
    }).toString();
  });
  const [isShareWithTime, setIsShareWithTime] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const onClickControl = useCallback(() => {
    toggle();
  }, [toggle, isPlayed]);

  const toggleShareDialog = useCallback(() => {
    setIsShareDialogOpen(state => !state);
  }, []);

  const toggleShareWithTime = useCallback(() => {
    setIsShareWithTime(state => !state);
  }, [isShareWithTime]);

  useEffect(() => {
    changeShareUrl(
      tap(new URL(window.location.toString()), url => {
        url.searchParams.set('track', tracks.findIndex(track => track.order === currentTrack?.order).toString());
        url.searchParams.set('currentTime', '');
      }).toString()
    );
  }, [currentTrack]);

  useEffect(() => {
    const url = new URL(window.location.toString());
    if (isShareWithTime) {
      url.searchParams.set('track', tracks.findIndex(track => track.order === currentTrack?.order).toString());
      url.searchParams.set('currentTime', currentTime.toString());
    } else {
      url.searchParams.set('track', tracks.findIndex(track => track.order === currentTrack?.order).toString());
      url.searchParams.set('currentTime', '');
    }

    changeShareUrl(url.toString());

  }, [isShareWithTime])

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

  const onCopy = useCallback(() => {
    if (!shareInputRef.current) {
      return;
    }

    shareInputRef.current.focus();
    shareInputRef.current.setSelectionRange(0, shareInputRef.current.value.length);
    document.execCommand('copy');
    setTimeout(() => toggleShareDialog(), 0);
  }, [])

  const onShareFocus = useCallback(() => {
    if (!shareInputRef.current) {
      return;
    }

    shareInputRef.current.setSelectionRange(0, shareInputRef.current.value.length);
  }, []);

  const onClickTitle = useCallback(() => {
    setLocationTrack(tracks.findIndex(track => track.order === currentTrack?.order).toString());
  }, []);

  if (!currentTrack) {
    return null;
  }

  const { backgroundColor, playColor } = currentTrack;


  return (
    <>
      <div className={Styles.PlayerWrapper}>
        <div className={Styles.Player} style={{ backgroundColor, color: playColor }}>
          <div className={Styles.Player__Title}>
            <span className={Styles.Player__TrackTitle} onClick={onClickTitle}>
              {currentTrack.order} {currentTrack.greeting}
            </span>
            <div>
              <span className={Styles.Player__Icon} onClick={toggleShareDialog}><ShareIcon /></span>
              <span className={Styles.Player__Icon} onClick={closeTrack}><CloseIcon /></span>
            </div>
          </div>
          <div className={Styles.Player__Controls}>
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
        </div>
      </div>
      <Dialog
        open={isShareDialogOpen}
        onClose={toggleShareDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Input value={shareUrl} fullWidth onClick={onShareFocus} inputRef={shareInputRef} />
          <FormControlLabel 
            control={<Checkbox checked={isShareWithTime} onChange={toggleShareWithTime} />} 
            label="С текущего момента" 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleShareDialog} color='secondary'>
            Закрыть
          </Button>
          <Button onClick={onCopy} color='primary' autoFocus>
            Копировать
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}