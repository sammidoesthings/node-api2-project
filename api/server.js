// implement your server here
// require your posts router and connect it here
const express = require('express')

//router imports

const PostsRouter = require('./posts/posts-router')

//server import
const server = express()
server.use(express.json())

//router use
server.use('/api/posts', PostsRouter)


//test get request

server.get('/', (req, res) => {
    res.send(`
    <h2>Posts</h2>
    <p>Welcome to the Posts API!</p>`)
})


module.exports = server