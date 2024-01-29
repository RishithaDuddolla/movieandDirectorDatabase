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
    app.listen(3000, () => {
      console.log('server starts at 3000 port')
    })
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}
makeServerDBconnection()
app.get('/movies/', async (request, response) => {
  const dbquery = `select movie_name from movie order by movie_id;`
  const dbresponse = await db.all(dbquery)
  response.send(dbresponse)
})
app.post('/movies/', async (request, response) => {
  const dbdeets = request.body
  const {movieId, directorId, movieName, leadActor} = dbdeets
  const dbquery = `insert into movie (movie_id ,
director_id,
movie_name,  
lead_actor) values(${movieId},${directorId},'${movieName}','${leadActor}');`
  const dbresponse = await db.run(dbquery)
  response.send('Movie Successfully added')
})
app.get('/movies/:movieId/', async (request, respponse) => {
  const movieId = request.params
  const dbquery = `select * from movie where movie_id=${movieId};`
  const dbresponse = await db.all(dbquery)
  response.send(dbresponse)
})
app.put('/movies/:movieId', async (request, response) => {
  const movieId = request.params
  const moviedeets = request.body
  const {directorId, movieName, leadActor} = moviedeets
  const dbquery = `update movie set (director_id=${directorId},movie_name='${movieName}',lead-actor='${leadActor}');`
  const dbresponse = await db.run(dbquery)
  response.send('Movie Details Updated')
})
app.delete('/movies/:movieId', async (request, response) => {
  const movieId = request.params
  const dbquery = `delete from movie where movie_id=${movieId};`
  const dbresponse = await db.run(dbquery)
  response.send('Movie Removed')
})
app.get('/directors/', async (request, response) => {
  const dbquery = `select * from director order by director_id;`
  const dbresponse = await db.all(dbquery)
  response.send(dbresponse)
})
app.get('/directors/:directorId/movies/', async (request, response) => {
  const directorId = request.params
  const dbquery = `select movie.movie_name from movie inner join director on movie.director_id=director.director_id;`
  const dbresponse = await db.all(dbquery)
  response.send(dbquery)
})
module.exports = app
