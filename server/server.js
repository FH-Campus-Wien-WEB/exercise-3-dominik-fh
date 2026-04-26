const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', function (req, res) {
    // Collect all genres, remove duplicates, and return them alphabetically.
    const genres = [...new Set(Object.values(movieModel.movies).flatMap(movie => movie.Genres))].sort()

    res.status(200).send(genres)
})

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */

app.get('/movies', function (req, res) {
    const {genre} = req.query
    const movies = Object.values(movieModel.movies)
    const filteredMovies = genre
        ? movies.filter(movie => movie.Genres.includes(genre))
        : movies

    res.status(200).send(filteredMovies)
})

app.get('/movies/:imdbID', function (req, res) {
    const imdbID = req.params.imdbID

    if (movieModel.movies[imdbID]) {
        res.status(200).send(movieModel.movies[imdbID])
    } else {
        res.status(404).send('Movie not found!')
    }
})

app.put('/movies/:imdbID', function (req, res) {
    const imdbID = req.params.imdbID
    const movie = req.body

    if (movieModel.movies[imdbID]) {
        movieModel.movies[imdbID] = movie
        res.sendStatus(200)
    } else {
        movieModel.movies[imdbID] = movie
        res.status(201).send(movie)
    }
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
