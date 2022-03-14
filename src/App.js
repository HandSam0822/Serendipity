import "bootstrap/dist/css/bootstrap.min.css"
import SearchBar from "./SearchBar";
import DisplayTable from "./DisplayTable";
import { useState, useEffect, useRef} from "react";
import Modal from 'antd/lib/modal/Modal';
import "./static/App.css";
import {getToken} from './APIController';

function App() {
  const [tableValue, setTableValue] = useState([])  
  const [notFound, setNotFound] = useState(false);
  const [token, setToken] = useState(""); 
  
  useEffect(async()=> {
    const result = await getToken()
    setToken(result);
  }, [])
  

  const changeTableValue = (data) => {    
    if (data.length === 0) {
      setNotFound(true)
      setTableValue([]);
    } else {
      setTableValue(data);
      setNotFound(false)
    }    
  }
  
  // https://stackoverflow.com/questions/67859760/play-only-one-song-at-a-time-react
  // 把play的state傳進去，如果play的話className=play, else pause(起始狀態皆為pause)
  const [isPlaying, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const audio = useRef(null);
  const togglePlay = (preview_url) => {
    const song = preview_url;
    if (currentSong === song) {
      isPlaying ? audio.current.pause() : audio.current.play();
      setPlaying(!isPlaying);
    } else {
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
      <SearchBar token = {token} notFound = {notFound} changeTableValue = {changeTableValue} />            
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
