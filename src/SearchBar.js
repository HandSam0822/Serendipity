import React from 'react'
import { useState } from 'react'
import {Card, Input, List, Select} from 'antd';
import TrackCard from './TrackCard';
import 'antd/dist/antd.css';
import "./static/App.css";
import {getRecommendSongs, getSearchResults} from './APIController';

// Search bar in antd
const { Search } = Input;

// Drop down Select in antd
const { Option } = Select;

const SearchBar = (props) => {    
    // track name shown on search bar
    const [track, setTrack] = useState("")
    
    // number of song recommendation. It is set to 3 by default
    const [recommendNumber, setRecommendNumber] = useState(3)  

    // the uri is to be sent to getRecommendSongs. 
    // If client didn't click track card to search result, even if the song is valid to
    // be searched, no response would be sent back. (Small bug)
    const [uri, setURI] = useState("")    
    
    // card is initially null so no trackcard are shown in browser
    const [card, setCard] = useState(null)
    
    /**
     * When handelSubmit is triggered, it would send data to getRecommendSongs, 
     * receive response data, and change table value based on the response. 
     * Although this part should to be done in backend, 
     * the project scale is small enough to simply implement in front end. 
     */
    const handelSubmit = async() => {     
        const result = await getRecommendSongs(props.token, uri, recommendNumber);            
        props.changeTableValue(result);
        setTrack("")         
        setURI("")             
        setCard(null)          
    }
    
    /**
     * When one of the track in TrackCard is clicked, the global variable is updated
     * @param {*} trackInfo TrackCard that is clicked
     */
    function clickTrack(trackInfo) {                  
        setTrack(trackInfo.name)
        setURI(trackInfo.uri)
        setCard(null)
    }

    /**
     * When users type something on Searchbar, setOnSearch is triggered, 
     * track info would be set, Spotify API is fetched, 
     * response is returned, TrackCard is updated.
     * @param {event} event clicked component
     */
    const setOnSearch = async(event) => {
        setTrack(event.target.value);
        const tracks = await getSearchResults(props.token, event.target.value);                
        const results = [];
        tracks.forEach(track => {              
            results.push(<TrackCard key={track.uri} track = {track} click={clickTrack} />)
        });           
        // set card as a list of result where result is an array of TrackCard
        setCard(
        <Card>
            <List itemLayout="horizontal">
                {results}
            </List>
        </Card>
        )
    }

    return (
    <>
    <div className="form-group row">
        <div className="Search" >
            <Search
                placeholder="Type a song to search"
                enterButton="Search"
                size="large"
                onChange={setOnSearch}
                autoComplete='off'
                type='text'
                value={track}                
                onSearch={handelSubmit}
            />
          </div>
    </div>    
    {card}
    <Select
        placeholder="How many song to recommend"            
        allowClear
        onChange={value => setRecommendNumber(value)}
        bordered={true}
    >
    {[...Array(10)].map((x, i) =>            
            <Option key={i} value={i+1}>{i+1}</Option>
        )}         
    </Select>     
    </>
    )
}

export default SearchBar
