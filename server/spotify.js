const spotifyWebApi=require("spotify-web-api-node");
const spotapi=new spotifyWebApi({
    clientId:process.env.SPOTIFY_CLIENT_ID,
    clientSecret:process.env.SPOTIFY_CLIENT_SECRET,
});

async function tamilsongsacrdtomood(){
    try{
        const data = await spotapi.clientCredentialsGrant();
        console.log('access token is '+data.body['access_token']);
        spotapi.setAccessToken(data.body['access_token']);
    }catch(error){
        console.error("Error getting spotify access token:",error);
        throw new Error("Failed to get spotify access token");
    }
}
async function getSongsAndArtists(mood, musicData){
    try{
        await tamilsongsacrdtomood();
        const seed_artists=musicData.artists.slice(0,3);   
        const recom = await spotapi.getRecommendations({
            seed_artists:seed_artists,
            limit:20,           
        });
       
        const trackuri = recom.body.tracks.map((track)=>track.uri);
        const uid = 'y86ksw5pssn1uup8eapk0hq7e';
        const playlist = `Mood ${mood}`;
        const newplaylist = await spotapi.createPlaylist(
            uid, playlist, {'description':`A playlist for the mood: ${mood}by gemini`,'public':true
        });
        console.log('Playlist created:',newplaylist.body);
        const playlistid = newplaylist.body.id;
        if(trackuri.length>0){
        await spotapi.addTracksToPlaylist(playlistid, trackuri);
        console.log('Tracks added to playlist');
        }else{
            console.log('No tracks found to add to the playlist');
        }
        return newplaylist.body;
    }catch(error){
        console.error("Error creating playlist or adding tracks:",error);
        throw new Error("Failed to create playlist or add tracks");
    }
}

module.exports={getSongsAndArtists};
