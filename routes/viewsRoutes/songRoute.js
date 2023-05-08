const axios = require('axios');
const express = require('express');
const router = express.Router();
const getTrackData = require('../apiRoutes/deezerAPI');
const database = require('../../database');

// Route to get songs for a specific album
router.get('/album/:albumName', async (req, res) => {
  try {
    const albumName = req.params.albumName;
    const response = await axios.get(`http://localhost:3000/songs/album/${albumName}`);
    const response2 = await axios.get(`http://localhost:3000/collections`);
    const songs = response.data;
    const collections = response2.data;
    const songData = [];

    // Iterating over the response.data from the first response
    for (let i = 0; i < songs.length; i++) {
      // Using getTrackData function from DeezerAPI file
      const trackData = await getTrackData(songs[i].artist_name, songs[i].song_name);

      // Pushing the trackdata into the songData array, will be used in 'songs'
      songData.push({
        songName: songs[i].song_name,
        artistName: songs[i].artist_name,
        imageUrl: trackData.albumCoverUrl,
        audioUrl: trackData.previewUrl,
      });
    }

    
    let sessionObj = req.session;
    if (sessionObj.authen) {
      // If user is logged in
      let uid = sessionObj.authen;
      console.log(uid); // For debugging purposes
      let userQuery = `SELECT user.user_id, user.user_name, user_collection.user_collection_id
      FROM user_collection
      JOIN user ON user.user_id = user_collection.user_id
      WHERE user.user_id = ?
      `;
      database.query(userQuery, [uid], (err, row) => {
        if (err) {
          throw err;
        } else {
          let firstRow = null; // Initialise userdata as null, prevents error 
          if(row.length>0){
            firstRow = row[0];
          }
          
          res.render('songs', { songData, collections, userdata: firstRow, message : 'Welcome' });
        }
      });
    } else {
      // Not logged in so no user data sent
      res.render('songs', { songData, collections, message : 'Please log in' });
    }
  } catch (err) {
    console.error(err);
  }
});


// Route to get songs for a search
router.get('/results/:search', async (req, res) => {
  try {
    const search = req.params.search;
    const response = await axios.get(`http://localhost:3000/search/${search}`);
    const response2 = await axios.get(`http://localhost:3000/collections`);
    const songs = response.data;
    const collections = response2.data;
    const songData = [];
     // Iterating over the response.data from the first response
    for (let i = 0; i < songs.length; i++) {
      // Using getTrackData function from DeezerAPI file
      const trackData = await getTrackData(songs[i].artist_name, songs[i].song_name);
      // Pushing the trackdata into the songData array, will be used in 'songs'
      songData.push({
        songName: songs[i].song_name,
        artistName: songs[i].artist_name,
        imageUrl: trackData.albumCoverUrl,
        audioUrl: trackData.previewUrl,
      });
    }

    let sessionObj = req.session;
    if (sessionObj.authen) {
      let uid = sessionObj.authen;
      let userQuery = `SELECT user.user_id, user.user_name, user_collection.user_collection_id
      FROM user_collection
      JOIN user ON user.user_id = user_collection.user_id
      WHERE user.user_id = ?`;
      database.query(userQuery, [uid], (err, row) => {
        if (err) {
          throw err;
        } else {
          let firstRow = null; //initialise userdata as null
          if(row.length>0){
            firstRow = row[0];
          }
          
          res.render('songs', { songData, collections, userdata: firstRow, message : 'Welcome' });
        }
      });
    } else {
      res.render('songs', { songData, collections , message : 'Please log in'});
    }
  } catch (err) {
    console.error(err);
  }
});


// Route to get songs for a specific genre
router.get('/genres/:genreName', (req, res) => {
  const genreName = req.params.genreName;

  const url = `http://localhost:3000/songs/${genreName}`;
  const url2 = `http://localhost:3000/collections`;

  axios.all([axios.get(url), axios.get(url2)])
    .then(axios.spread((firstResponse, secondResponse) => {

      // console.log(firstResponse.data, secondResponse.data);
      let data = firstResponse.data;
      let collections = secondResponse.data;
      res.render('songs', { data, collections, message : 'Please log in' });

    }));
});


// Route to get songs for a collection
router.get('/collections/:collection', async (req, res) => {
  try {
    const collection = req.params.collection;
    const response = await axios.get(`http://localhost:3000/collection/${collection}`);
    console.log(response.data); // Debugging purposes
    const response2 = await axios.get(`http://localhost:3000/collections`);
    const songs = response.data;
    const collections = response2.data;
    const songData = [];

    // Iterating over the response.data from the first response
    for (let i = 0; i < songs.length; i++) {
      // Using getTrackData function from DeezerAPI file
      const trackData = await getTrackData(songs[i].artist_name, songs[i].song_name);
      // Pushing the trackdata into the songData array, will be used in 'songs'
      songData.push({
        songName: songs[i].song_name,
        artistName: songs[i].artist_name,
        imageUrl: trackData.albumCoverUrl,
        audioUrl: trackData.previewUrl,
      });
    }

    let sessionObj = req.session;
    if (sessionObj.authen) {
      let uid = sessionObj.authen;
      let userQuery = `SELECT user.user_id, user.user_name, user_collection.user_collection_id
      FROM user_collection
      JOIN user ON user.user_id = user_collection.user_id
      WHERE user.user_id = ?`;
      database.query(userQuery, [uid], (err, row) => {
        if (err) {
          throw err;
        } else {
          let firstRow = null; //initialise userdata as null
          if(row.length>0){
            firstRow = row[0];
          }
          
          res.render('songs', { songData, collections, userdata: firstRow, message : 'Please log in' });
        }
      });
    } else {
      res.render('songs', { songData, collections , message : 'Please log in'});
    }
  } catch (err) {
    console.error(err);
  }
});


module.exports = router; 
