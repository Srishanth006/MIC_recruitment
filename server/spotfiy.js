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
async function getSongsAndArtists(prompt,musicData){
    try{
        await authenticatespotify();
        const recom=await spotapigetrecomm({
            seed_songs:musicData.songs.slice(0,5),
            seed_artists:musicData.artists.slice(5,8),
            limit: 20,
        });
        const trackuri=recom.body.tracks.map((track)=>track.uri);
        const uid='y86ksw5pssn1uup8eapk0hq7e';
        const playlist=`Mood ${mood}`;
        const newplaylist=await spotapi.createPlaylist(uid,playlist,{'description':`A playlist for the mood: ${mood}`,'public':true});
         
        console.log('Playlist created:',newplaylist.body);
        const playlistid=newplaylist.body.id;
        await spotapi.addTracksToPlaylist(playlistid,trackuri);
        console.log('Tracks added to playlist');
        return newplaylist.body;

    }catch(error){
        console.error("Error creating playlist or adding tracks:",error);
        throw new Error("Failed to create playlist or add tracks");
    }
}
module.exports={tamilsongsacrdtomood,getSongsAndArtists};