// All styleing includes table and icon is from ant design packages
import React from 'react'
import { Table} from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, AudioMutedOutlined } from '@ant-design/icons';
import "./static/App.css";

/**
 * A table to display recommend song. Song preview feature is also 
 * described here. In fact, table in ant design could be coded in various
 * way, I just choose one of them. 
 * You could check official documentation for detail.
 * @param {props} props properties of display table, including function, status, varaibles.
 * @returns {Table} antd table 
 */
const DisplayTable = (props) => {   
    // there are 5 columns in total. Respectively 
    // 1. play button(indicating play and pause status of the song)
    // 2. Album photo
    // 3. Track info(Track name, artist name)
    // 4. Album info
    // 5. Track duration
    // record is the data in <Table datasource={props.data}>
    const columns = [{
        title: '',
        dataIndex: 'playButton',
        key: 'playButton',
        render: (text, record) => {                              
            if (record.preview_url === null) {                
                return <AudioMutedOutlined className='playButton' />
            }  
            if (props.isPlaying && props.currentSong === record.preview_url) {
                return <PauseCircleOutlined className="playButton" onClick={()=>props.clickPlayMusic(record.preview_url)}/>
            } else {
                return <PlayCircleOutlined className="playButton" onClick={()=>props.clickPlayMusic(record.preview_url)}/>
            }
        }                                
    },
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (img) => {
                return (
                    <img src={img} alt=""></img>
                )
            }
        },
        {
            title: 'Track',
            dataIndex: 'name',
            key: 'name',
            
            render: (trackName, record) => {
                return <div>
                    <div className='track-name'>                    
                    <a  href={record.external_urls.spotify}>{trackName}</a>          
                    </div>
                    <div className='track-artist'>{record.artist}</div>
                </div>
            }
        },
       {
        title: 'Album',
        dataIndex: 'album', 
        key: 'album',  
        render :(album) => {
            return <div className='track-album'>{album}</div>
        }        
       },
       {
        title: 'duration',
        dataIndex: 'duration', 
        key: 'duration',
       },
       ];
      
    return (
        <>
        <Table columns={columns} dataSource={props.data} rowKey="name" bordered />        
        </>
    )
}

export default DisplayTable
