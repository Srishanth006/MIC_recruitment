const spotifyWebApi = require("spotify-web-api-node");
const spotapi = new spotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function tamilsongsacrdtomood() {
    try {
        const data = await spotapi.clientCredentialsGrant();
        console.log('Access token acquired.');
        spotapi.setAccessToken(data.body['access_token']);
    } catch (error) {
        console.error("Error getting spotify access token:", error.message);
        throw new Error("Failed to get spotify access token");
    }
}

async function getArtistIds(artistNames) {
    const artistIds = [];
    console.log(`Searching for IDs for artists: ${artistNames.join(', ')}`);

    for (const artistName of artistNames) {
        try {
            const searchResult = await spotapi.searchArtists(artistName);
            const artists = searchResult.body.artists.items;

            if (artists.length > 0) {
                artistIds.push(artists[0].id);
                console.log(`Found ID for ${artistName}: ${artists[0].id}`);
            } else {
                console.log(`Could not find an artist ID for: ${artistName}`);
            }
        } catch (searchError) {
            console.error(`Error searching for artist ${artistName}:`, searchError.message);
        }
    }
    return artistIds;
}

async function getSongsAndArtists(mood, musicData) {
    try {
        const uid = 'y86ksw5pssn1uup8eapk0hq7e';

        await tamilsongsacrdtomood();

        const artistNames = musicData.artists.slice(0, 3);
        const seed_artists = await getArtistIds(artistNames);

        if (seed_artists.length === 0) {
            throw new Error("Could not find valid Spotify artist IDs for the given mood.");
        }

        console.log('--- FINAL DATA: Sending to Spotify ---');
        console.log('User ID:', uid);
        console.log('Final Artist Seed IDs:', seed_artists);
        console.log('------------------------------------');

        const recom = await spotapi.getRecommendations({
            seed_artists: seed_artists,
            limit: 20,
        });

        const trackuri = recom.body.tracks.map((track) => track.uri);
        const playlistName = `Mood: ${mood}`;
        const newplaylist = await spotapi.createPlaylist(uid, playlistName, {
            'description': `A playlist for the mood: ${mood} by Gemini AI`,
            'public': true
        });

        console.log('Playlist created:', newplaylist.body.name);
        const playlistid = newplaylist.body.id;

        if (trackuri.length > 0) {
            await spotapi.addTracksToPlaylist(playlistid, trackuri);
            console.log('Tracks added to playlist');
        } else {
            console.log('No tracks found to add to the playlist.');
        }

        return newplaylist.body;
    } catch (error) {
        console.error("Error creating playlist or adding tracks:", error.body || error.message);
        throw new Error("Failed to create playlist or add tracks");
    }
}

module.exports = { getSongsAndArtists };