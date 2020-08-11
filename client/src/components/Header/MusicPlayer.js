import React, { Fragment } from "react";

import "../../styles/musicPlayerAtHeader.scss";
import LinearBuffer from "./LinearBuffer";

const MusicPlayer = (props) => {
  const { windowWidth } = props;

  const onPlayButtonClick = () => {
    return (
      <audio id='song'>
        <source
          src='https://res.cloudinary.com/praveennagaraj97/video/upload/v1597155035/Alec_Benjamin_-_Let_Me_Down_Slowly_Official_Music_Video_buhiip.mp3'
          type='audio/mpeg'></source>
      </audio>
    );
  };

  return (
    <div className='music-player-box'>
      {onPlayButtonClick()}
      <div className='music-player__control'>
        <div className='music-player-control_buttons'>
          <img
            className='music-player__control-Btn'
            src='https://img.icons8.com/bubbles/50/000000/circled-chevron-left.png'
            alt='Prev'
            height='48px'
          />
          <img
            onClick={() => {
              const audio = document.getElementById("song");
              audio.paused ? audio.play() : audio.pause();
            }}
            className='music-player__control-Btn'
            src='https://img.icons8.com/bubbles/2x/play.png'
            height='45px'
            alt='Play'
          />

          <img
            className='music-player__control-Btn'
            src='https://img.icons8.com/bubbles/50/000000/circled-chevron-right.png'
            height='48px'
            alt='Next'
          />
        </div>
        {windowWidth > 900 ? (
          <Fragment>
            <div className='music-player__currentTrack'>
              Alec_Benjamin_-_Let_Me_Down_Slowly_Official_Music
            </div>

            <LinearBuffer />
          </Fragment>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
