import "bootstrap/dist/css/bootstrap.min.css"
import SearchBar from "./SearchBar";
import DisplayTable from "./DisplayTable";
import { useState, useEffect, useRef} from "react";
import Modal from 'antd/lib/modal/Modal';
import "./static/App.css";
import {getToken} from './APIController';

/**
 * Main function of the project. 
 * Init the project setting and return html structure  
 * @returns {html} html displayed in the home page
 */
function App() {
  // table value is the response of song recommendation
  const [tableValue, setTableValue] = useState([])  
  // if notFound = true, not found modal will be shown
  const [notFound, setNotFound] = useState(false);
  // authorization token
  const [token, setToken] = useState(""); 
  // run getToken() in APIController.js to set token value 
  // one and only one time at the beginning
  useEffect(async()=> {
    const result = await getToken()
    setToken(result);
  }, [])
  

  /**
   * A function to change table value.
   * If the data is empty, set table value to empty. 
   * Otherwise, set table value to data.
   * @param {Array} data an array of song recommendation(json object)
   */
  const changeTableValue = (data) => {    
    if (data.length === 0) {
      setNotFound(true)
      setTableValue([]);
    } else {
      setTableValue(data);
      setNotFound(false)
    }    
  }
  
  /**
   * status to render play and pause button. 
   * If play = true, className = play, else className = pause. 
   * By default, play is set to false.
  // Reference: https://stackoverflow.com/questions/67859760/play-only-one-song-at-a-time-react
   */
  const [isPlaying, setPlaying] = useState(false);
  /**
   * Currently playing song. By default, it is set to null.
   */
  const [currentSong, setCurrentSong] = useState(null);
  /**
   * Apply in playing 30 second preview. 
   */
  const audio = useRef(null);
  
  /**
   * Triggered when clients click the play button.
   * It would set current song value, play that song,
   * and pause every other songs that was playing.
   * @param {*} preview_url url of preview songs
   */
  const togglePlay = (preview_url) => {
    const song = preview_url;
    // if currentSong = song, if audio status is pause, play it, else, pause it.
    if (currentSong === song) {
      isPlaying ? audio.current.pause() : audio.current.play();
      setPlaying(!isPlaying);
    } else {
      // if currently, audio is playing other song, pause it
      if (audio.current) {
        audio.current.pause();
      }
      setCurrentSong(song);
      setPlaying(true);
      audio.current = new Audio(song);
      audio.current.play();
    }
  };
  
  return (    
    <>
      <div className="body">
      <SearchBar token = {token} changeTableValue = {changeTableValue} />            
      <Modal
          title="Song not found"
          visible={notFound}
          cancelButtonProps={{ style: { display: 'none' } }}
          onOk={()=>setNotFound(false)}          
          okText="Ok"          
        >
          <p>The song is not found</p>          
      </Modal>  

      { tableValue.length > 0 
      ? <DisplayTable data={tableValue} clickPlayMusic = {togglePlay} currentSong = {currentSong} isPlaying = {isPlaying}/> 
      : null}
      </div>
    </>
  );
}

export default App;
