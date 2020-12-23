import { memo, useRef, useState } from 'react';

import { Playlist } from 'components/Playlist/Playlist';
import { Player } from 'components/Player/Player';
import { default as Styles } from 'App.module.css';
import { PlayerProvider } from 'components/PlayerContext/PlayerContext';

function AppComponent() {
  return (
    <PlayerProvider>
      <header className={Styles.Header}>
        <a href='https://youknow.st' target='_blank'>
          <span className={Styles.Header__Logo} />
        </a>
        <span className={Styles.Header__Name}>2020</span>
      </header>
      <Playlist />
      <Player />
    </PlayerProvider>
  );
}

export const App = memo(AppComponent);