const axios = require('axios');

const API_KEY = 'c07bba648dmsh47a7983f046ef33p1bc767jsn4d1512079676';
const DEEZER_URL = 'https://deezerdevs-deezer.p.rapidapi.com';

// Function to get track data for an artist and track name
const getTrackData = async (artist, track) => {
  const query = `artist:"${artist}" track:"${track}"`;
  const encodedquery = encodeURIComponent(query);

  const url = `https://api.deezer.com/search?q=${encodedquery}&limit=1`;

  try {
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
        'x-rapidapi-key': API_KEY,
      },
    });

    const trackId = response.data.data[0].id;
    const previewUrl = response.data.data[0].preview;
    const albumCoverUrl = response.data.data[0].album.cover_medium;

    console.log(`Track ID: ${trackId}`);
    console.log(`Preview URL: ${previewUrl}`);
    console.log(`Album Cover URL: ${albumCoverUrl}`);

    return {
      trackId: trackId,
      previewUrl: previewUrl,
      albumCoverUrl: albumCoverUrl,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error');
  }
};

module.exports = getTrackData;

