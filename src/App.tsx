import { Playlist } from 'components/Playlist/Playlist';
import { default as Styles } from 'App.module.css';

export function App() {
  return (
    <>
      <header className={Styles.Header}>
        <a href='https://youknow.st' target='_blank'>
          <span className={Styles.Header__Logo} />
        </a>
        <span className={Styles.Header__Name}>2020</span>
      </header>
      <Playlist />
    </>
  );
}