const spotifyWebApi = require("spotify-web-api-node");
const spotapi = new spotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getAccessToken() {
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
        await getAccessToken();

        const artistNames = musicData.artists.slice(0, 3);
        const rawgenre = musicData.genres.slice(0, 2);
        const seed_genres = rawgenre.map(genre => genre.toLowerCase().replace(/\s+/g, '-'));
        console.log('made the genres sanitized', seed_genres);

        let recommendations = null;

        if (seed_artists.length > 0 && seed_genres.length > 0) {
            console.log("Attempting recommendations with Artists + Genres...");
            try {
                recommendations = await spotapi.getRecommendations({
                    seed_artists: seed_artists,
                    seed_genres: seed_genres,
                    limit: 20,
                });
            } catch (e) {
                console.log("Artists + Genres failed. Trying fallback.");
            }
        }

        if ((!recommendations || !recommendations.body || recommendations.body.tracks.length === 0) && seed_genres.length > 0) {
            console.log("Attempting recommendations with Genres ONLY...");
            try {
                recommendations = await spotapi.getRecommendations({
                    seed_genres: seed_genres,
                    limit: 20,
                });
            } catch (e) {
                console.log("Genres ONLY failed. Trying fallback.");
            }
        }

        if ((!recommendations || !recommendations.body || recommendations.body.tracks.length === 0) && seed_artists.length > 0) {
            console.log("Attempting recommendations with Artists ONLY...");
            try {
                recommendations = await spotapi.getRecommendations({
                    seed_artists: seed_artists,
                    limit: 20,
                });
            } catch (e) {
                console.log("Artists ONLY failed. All fallbacks exhausted.");
            }
        }
        
        if (!recommendations || !recommendations.body || recommendations.body.tracks.length === 0) {
            throw new Error("Could not generate recommendations from any available seeds.");
        }

        const trackuri = recommendations.body.tracks.map((track) => track.uri);
        const playlistName = `Mood: ${mood}`;
        const newplaylist = await spotapi.createPlaylist(uid, playlistName, {
            'description': `A playlist for the mood: ${mood} by Gemini AI`,
            'public': true
        });

        console.log('Playlist created:', newplaylist.body.name);
        const playlistid = newplaylist.body.id;

        await spotapi.addTracksToPlaylist(playlistid, trackuri);
        console.log('Tracks added to playlist');
        
        return newplaylist.body;
    } catch (error) {
        console.error("--- SPOTIFY API ERROR ---");
        console.error(error.body || error.message);
        console.error("-------------------------");
        throw new Error("Failed to create playlist or add tracks");
    }
}

module.exports = { getSongsAndArtists };