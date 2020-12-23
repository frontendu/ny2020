import { useState } from 'react';

import { generateColor } from 'generateColor';
import { TrackDto } from 'dto/Track';
import Styles from 'components/Track/Track.module.css';

type TrackProps = {
  track: TrackDto;
  onClick: (url: string) => void;
}

export function Track({
  track: {
    order,
    greeting,
    emoji,
    url,
  },

  onClick
}: TrackProps) {
  const [[backgroundColor, greetingColor, playColor]] = useState(() => ([
    generateColor(),
    generateColor(),
    generateColor()
  ]));

  return (
    <div className={Styles.Track}>
      <div className={Styles.Track__Box} style={{backgroundColor}}>
        <div className={Styles.Track__Order}>{order}</div>
        <div className={Styles.Track__Greeting} style={{backgroundColor: greetingColor}}>{greeting}</div>
        <div className={Styles.Track__Play} style={{backgroundColor: playColor}} onClick={() => onClick(url)}>{emoji}</div>
      </div>
    </div>
  )
}