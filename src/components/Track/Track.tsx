import Styles from 'components/Track/Track.module.css';
import { TrackEntity } from 'components/PlayerContext/PlayerContext';

type TrackProps = {
  track: TrackEntity;
  isCurrent: boolean;
  onClick: (order: number) => void;
}

export function Track({
  track: {
    order,
    greeting,
    emoji,
    backgroundColor,
    greetingColor,
    playColor
  },
  isCurrent,
  onClick
}: TrackProps) {
  return (
    <div className={Styles.Track}>
      <div className={[Styles.Track__Box, isCurrent && Styles.Track__Box_Current].join(' ')} style={{backgroundColor}}>
        <div className={Styles.Track__Order}>{order}</div>
        <div className={Styles.Track__Greeting} style={{backgroundColor: greetingColor}}>{greeting}</div>
        <div className={Styles.Track__Play} style={{backgroundColor: playColor}} onClick={() => onClick(order)}>{emoji}</div>
      </div>
    </div>
  )
}