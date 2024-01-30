const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
app.use(express.json())
const path = require('path')
const dbpath = path.join(__dirname, 'moviesData.db')
const makeServerDBconnection = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000)
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}
makeServerDBconnection()
app.get('/movies/', async (request, response) => {
  const dbquery = `select movie_name from movie`
  const dbresponse = await db.all(dbquery)
  response.send(dbresponse)
})
app.post('/movies/', async (request, response) => {
  const dbdeets = request.body
  const {directorId, movieName, leadActor} = dbdeets
  const dbquery = `insert into movie (
director_id,
movie_name,  
lead_actor) values(${directorId},'${movieName}','${leadActor}');`
  const dbresponse = await db.run(dbquery)
  response.send('Movie Successfully Added')
})
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const dbquery = `select * from movie where movie_id=${movieId};`
  const dbresponse = await db.get(dbquery)
  response.send(dbresponse)
})
app.put('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const moviedeets = request.body
  const {directorId, movieName, leadActor} = moviedeets
  const dbquery = `update movie set director_id=${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  where movie_id = ${movieId};`
  const dbresponse = await db.run(dbquery)
  response.send('Movie Details Updated')
})
app.delete('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const dbquery = `delete from movie where movie_id=${movieId};`
  const dbresponse = await db.run(dbquery)
  response.send('Movie Removed')
})
app.get('/directors/', async (request, response) => {
  const dbquery = `select  director.director_id,director.director_name from movie inner join director on movie.director_id=director.director_id ;`
  const dbresponse = await db.all(dbquery)
  response.send(dbresponse)
})
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const dbquery = `select movie_name from movie where director_id=${directorId};`
  const dbresponse = await db.all(dbquery)
  response.send(dbresponse)
})
module.exports = app
