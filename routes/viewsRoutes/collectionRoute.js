const axios = require('axios');
const express = require('express');
const router = express.Router();
const database = require('../../database');


router.get('/createcollection', (req, res) => {
  let sessionObj = req.session;
  if (sessionObj.authen) {
    let uid = sessionObj.authen;
    let user = `SELECT * FROM user WHERE user_id = ?`;
    database.query(user, [uid], (err, row) => {
      if(err) throw err;
      let firstrow = row[0];
      axios.get('http://localhost:3000/collections').then(response => {
        const data = response.data;

        res.render('createcollection', { userdata: firstrow, data });
      });


    });
  } else {

    res.render('loginrequired');
  }
});


// Handling removal of a collection
router.post('/collections/:userCollectionId/remove-collection', (req, res) => {
  const userCollectionId = req.params.userCollectionId;

  let deletesql = `-- Delete comments associated with the collection
    DELETE FROM comments
    WHERE user_collection_id = ?;
  
    DELETE FROM usercollection_songs
    WHERE user_collection_id = ?;
  
    DELETE FROM user_collection
    WHERE user_collection_id = ?;`

  database.query(deletesql, [userCollectionId, userCollectionId, userCollectionId], (err, rows) => {
    if (err) throw err;
    res.redirect('/createcollection');
  });
});

// Handling removal of a song from a collection
router.post('/collections/:userCollectionId/remove-song', (req, res) => {
  const userCollectionId = req.params.userCollectionId;
  const songId = req.body.song_id;

  let deletesql = `
    DELETE FROM usercollection_songs
    WHERE user_collection_id = ? AND song_id = ?; `

  database.query(deletesql, [userCollectionId, songId], (err, rows) => {
    if (err) throw err;
    res.redirect('/createcollection');
  });
});

// Handling creation of collection
router.post('/create-collection', (req, res) => {
  let collectionName = req.body.collectionName
  let collectionDescription = req.body.collectionDescription;
  let userId = req.body.userId;

  let insertsql = `INSERT INTO user_collection (collection_title, collection_description, user_id)
     VALUES (?, ?, ?)`;

  database.query(insertsql, [collectionName, collectionDescription, userId], (err, rows) => {
    if (err) throw err;
    res.redirect('/createcollection');
  });


});

// Handling adding songs to collection
router.post('/collections', (req, res) => {
  let song_name = req.body.song_name;
  let user_collection_id = req.body.user_collection_id;

  let insertsql = `INSERT INTO usercollection_songs (user_collection_id, song_id)
     VALUES (?, (SELECT song_id FROM song WHERE song_name = ?))`;

  database.query(insertsql, [user_collection_id, song_name], (err, rows) => {
    if (err) throw err;
    res.redirect('javascript:history.back()');
  });

});

module.exports = router;