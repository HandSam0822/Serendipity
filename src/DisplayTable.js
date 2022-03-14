import React from 'react'
import { Table} from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, AudioMutedOutlined } from '@ant-design/icons';
import "./static/App.css";

const DisplayTable = (props) => {   
    const columns = [{
        title: '',
        dataIndex: 'playButton',
        key: 'playButton',
        render: (text, record) => {                              
            if (record.preview_url === null) {
                return <AudioMutedOutlined style={{ fontSize: '20px', color: '#08c' }} />
            }  
            if (props.isPlaying && props.currentSong === record.preview_url) {
                return <PauseCircleOutlined style={{ fontSize: '20px', color: '#08c' }} onClick={()=>props.clickPlayMusic(record.preview_url)}/>
            } else {
                return <PlayCircleOutlined style={{ fontSize: '20px', color: '#08c' }} onClick={()=>props.clickPlayMusic(record.preview_url)}/>
            }
        }                                
    },
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (img) => {
                return (
                    <img src={img}></img>
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
