import React from 'react'
import {List, Avatar} from 'antd';

/**
 * TrackCard is List.Item that would be fed in List
 * @param {props} props proprty of TrackCard
 * @returns {List.Item} 
 */
const TrackCard = (props) => {
    let artists = []    
    props.track.artists.forEach(artist => artists.push(artist.name))
    return (
        <List.Item key={props.track.uri} onClick={()=>props.click(
          {
          "name": props.track.name, 
          "uri": props.track.id
          })}>
        <List.Item.Meta
          avatar={<Avatar shape='square' size='large' src={props.track.album.images[0].url} />}
          title={<p href="https://ant.design">{props.track.name}</p>}
          description={artists.join(', ')}
        />
      </List.Item>
      );    
}

export default TrackCard
