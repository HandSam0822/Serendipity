
/** When initially run the app, Spotiffy would require a token
 * to allow developer to fetch their API. Thus, clientId and 
 * clientSecret must be provided to get the token.
 */
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

/**
 * Convert millisecond to minutes : second in string format
 * @param {Number} duration_ms duration of the song
 * @returns {String} duration in <minutes:second> format
 */
const msToMinuteSecond = async(duration_ms) => {
    let totalSecond = duration_ms / 1000 >> 0;
    let totalMinute = totalSecond / 60 >> 0;
    totalSecond = totalSecond  % 60;
    // conver int to str
    totalMinute = totalMinute === 0 ? "00" : String(totalMinute);
    totalSecond = totalSecond < 10 ?  "0" + String(totalSecond): String(totalSecond);        
    return totalMinute + ":" + totalSecond;
}

/**
 * Given the uri of a song and the desired number of recommendation output, 
 * call Spotify API to get the result.
 * @param {String} token token provided by Spotify to prove authorization status
 * @param {String} uri uri of a song requested from clients
 * @param {*} recommendNumber number of recommendation requested from clients
 * @returns 
 */
const getRecommendSongs = async (token, uri, recommendNumber) => {              
    // if no valid song uri, return empty list 
    if (uri === "" || uri == null) return [];
    
    // if didn't provide a valid headers, result would be NULL
    const result = await fetch(`https://api.spotify.com/v1/recommendations?limit=${recommendNumber}&seed_tracks=${uri}`, {
        method: 'GET',
        'Content-Type' : 'application/x-www-form-urlencoded', 
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    // transform result into json format
    const response = await result.json();
    // an array to store return value
    const data = [];
    
    // process needed data from Spotify response and pass to frontend 
    response.tracks.forEach(async(track) => {
        // each track could have one to many artists
        let artists = []
        track.artists.forEach(artist => artists.push(artist.name))
        // change display format of the song duration, if don't use await, the web page would not display
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
