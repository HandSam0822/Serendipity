// require('dotenv').config()


var clientId = process.env.REACT_APP_AP_CLIENT_ID; 
var clientSecret = process.env.REACT_APP_AP_CLIENT_SECRET;


const getToken = async () => {    
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    return data.access_token;
}



const getSearchResults = async(token, query) => {        
    const fetchURL = encodeURI(`q=${query}`);
    const result = await fetch(`https://api.spotify.com/v1/search?${fetchURL}&type=track`, {
        method: "GET",
        'Content-Type' : 'application/x-www-form-urlencoded', 
        headers: {Authorization: `Bearer ${token}`}
    }).catch((error) => {
        console.log(error);
    });
    const tracks = await result.json();
    return tracks.tracks.items;
}
const msToMinuteSecond = async(duration_ms) => {
    let totalSecond = duration_ms / 1000 >> 0;
    let totalMinute = totalSecond / 60 >> 0;
    totalSecond = totalSecond  % 60;
    // conver int to str
    totalMinute = totalMinute === 0 ? "00" : String(totalMinute);
    totalSecond = totalSecond < 10 ?  "0" + String(totalSecond): String(totalSecond);        
    return totalMinute + ":" + totalSecond
}

const getRecommendSongs = async (token, uri, recommendNumber) => {              
    if (uri === "" || uri == null) return [];
    const result = await fetch(`https://api.spotify.com/v1/recommendations?limit=${recommendNumber}&seed_tracks=${uri}`, {
        method: 'GET',
        'Content-Type' : 'application/x-www-form-urlencoded', 
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const response = await result.json();
    const data = [];
    
    response.tracks.forEach(async(track) => {
        let artists = []
        track.artists.forEach(artist => artists.push(artist.name))
        const duration = await msToMinuteSecond(track.duration_ms)
        data.push({
            "album": track.album.name, 
            "image": track.album.images[2].url,
            "preview_url": track.preview_url,
            "external_urls": track.external_urls,
            "name": track.name,
            "artist": artists.join(", "),
            "duration": duration
        })
    });
    
    return data
}

export {getToken, getRecommendSongs, getSearchResults} 
