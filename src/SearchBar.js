import React from 'react'
import { useState, useEffect } from 'react'
import {Card, Input, List, Select} from 'antd';
import TrackCard from './TrackCard';
import 'antd/dist/antd.css';
import "./static/App.css";
import {getRecommendSongs, getSearchResults} from './APIController';

const { Search } = Input;
const { Option } = Select;

const SearchBar = (props) => {    
    const [track, setTrack] = useState("")
    const [recommendNumber, setRecommendNumber] = useState(3)    
    const [uri, setURI] = useState("")    
    const [card, setCard] = useState(null)
    
    // 後端會接收到最重要的兩個東西1. track(string) 2. recommendNumber(int)
    // 接著丟進sp跑結果，回傳a list of json object, 再丟給display table render結果
    const handelSubmit = async() => {     
        const result = await getRecommendSongs(props.token, uri, recommendNumber);            
        props.changeTableValue(result);
        setTrack("")         
        setURI("")             
        setCard(null)          
    }
    
    function clickTrack(trackInfo) {                  
        setTrack(trackInfo.name)
        setURI(trackInfo.uri)
        setCard(null)
    }

    const setOnSearch = async(e) => {
        console.log(e);
        setTrack(e.target.value);
        const tracks = await getSearchResults(props.token, e.target.value);                
        const results = [];
        tracks.forEach(track => {              
            results.push(<TrackCard key={track.uri} track = {track} click={clickTrack} />)
        });                                                    
        setCard(<Card><List itemLayout="horizontal">{results}</List></Card>)      
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
