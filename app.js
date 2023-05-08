require('dotenv').config();
// libraries 
const express = require('express');
let app = express();
const sessions = require('express-session');
const axios = require('axios');

//API routes
const songsAPI = require('./routes/apiRoutes/songsAPI');
const albumsAPI = require('./routes/apiRoutes/albumsAPI');
const artistsAPI = require('./routes/apiRoutes/artistsAPI');
const genresAPI = require('./routes/apiRoutes/genresAPI');
const usersAPI = require('./routes/apiRoutes/usersAPI');


//view routes
const searchRoute = require('./routes/viewsRoutes/searchRoute');
const signupRoute = require('./routes/viewsRoutes/signupRoute');
const loginRoute = require('./routes/viewsRoutes/loginRoute');
const genreRoute = require('./routes/viewsRoutes/genreRoute');
const songsRoute = require('./routes/viewsRoutes/songRoute');
const collectionRoute = require('./routes/viewsRoutes/collectionRoute');

const database = require('./database');

app.set('view engine', 'ejs');
app.set('views', './views');


app.use(express.static(__dirname + '/public'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Milliseconds 
const hour = 1000 * 60 * 60 * 1;
// Use keyword is for middle ware
app.use(sessions({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  // Session can be stored and saved without being initialised
  saveUninitialized: true,
  // The cookie on the client will only exist for one hour
  cookie: { maxAge: hour },
  resave: false
}));



// Routes for views
app.use('/', searchRoute);
app.use('/', signupRoute);
app.use('/', loginRoute);
app.use('/', genreRoute);
app.use('/', songsRoute);
app.use('/', collectionRoute);

// Routes for APIs
app.use('/', artistsAPI);
app.use('/', genresAPI);
app.use('/', songsAPI);
app.use('/', albumsAPI);
app.use('/', usersAPI);

// Route for not logged in home page
app.get('/', (req, res) => {
  let read = `SELECT album.album_name, genre.genre_name
    FROM album
    LEFT JOIN genre ON album.genre_id = genre.genre_id
    ;`
  // Executes the sql, function in arg deals with if err or if no err
  // err for if there is an err in call back statement, or if goes well albumdata sent
  database.query(read, (err, albumdata) => {
    if (err) throw err;
    axios.get('http://localhost:3000/collections')
      .then(response => {
        const data = response.data;
        console.table(albumdata) // Debugging purposes
        // Sending album data 
        res.render('index', { albumdata, message: 'Please log in', data });
      });
  });
});

// Route for logged in homepage
app.get('/dashboard', (req, res) => {
  let sessionobj = req.session;
  if (sessionobj.authen) {
    let uid = sessionobj.authen;
    let user = `SELECT * FROM user WHERE user_id = ?`;
    database.query(user, [uid], (err, row) => {
      let firstrow = row[0];
      axios.get('http://localhost:3000/collections').then(response => {
        const data = response.data;

          res.render('index', { userdata: firstrow, data });
        });
    });
  } else {
    res.render('loginrequired', { message: 'Please log in' });
  }
});




// POST for adding a comment and a rating
app.post('/add-comment', (req, res) => {
  // Data from the request body
  const { comment, user_collection_id, user_id, rating } = req.body;

  // SQL query to insert the data into the database
  const sql = 'INSERT INTO comments (comment, user_collection_id, user_id, rating) VALUES (?, ?, ?, ?)';
  const values = [comment, user_collection_id, user_id, rating];


  database.query(sql, values, (err, result) => {
    if (err) throw err;
    // Redirect the user back to the dashboard
    res.redirect('/dashboard'); 
  });
});







app.listen(process.env.PORT || 3000, () => {
  console.log("server started on: localhost:3000");
});