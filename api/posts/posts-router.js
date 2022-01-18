// implement your posts router here
const express = require('express')

const POSTS = require('./posts-model')
const router = express.Router()

// | 1 | GET | find() | / | Returns **an array of all the post objects** contained in the database|

// - If there's an error in retrieving the _posts_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The posts information could not be retrieved" }`.

router.get('/', (req, res) => {
    POSTS.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
})

// | 2 | GET | findById(id) | /:id | Returns **the post object with the specified id**|

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in retrieving the _post_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post information could not be retrieved" }`.


router.get('/:id', (req, res) => {
    POSTS.findById(req.params.id)
        .then(foundPost => {
            if (!foundPost) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
            res.status(200).json(foundPost)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post with the specified ID does not exist" })
        })
})

// | 3 | POST | insert(post)| / | Creates a post using the information sent inside the request body and returns **the newly created post object**|

// - If the request body is missing the `title` or `contents` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON: `{ message: "Please provide title and contents for the post" }`.

// - If the information about the _post_ is valid:

//   - save the new _post_ the the database.
//   - return HTTP status code `201` (Created).
//   - return the newly created _post_.

// - If there's an error while saving the _post_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON: `{ message: "There was an error while saving the post to the database" }`.

router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        POSTS.insert(req.body)
            .then(({id}) => {
                POSTS.findById(id)
                    .then(post => {
                        res.status(201).json(post)
                    })
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
    }
})

// | 4 | PUT | update(id, post) | /:id | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original|

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If the request body is missing the `title` or `contents` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON: `{ message: "Please provide title and contents for the post" }`.

// - If there's an error when updating the _post_:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post information could not be modified" }`.

// - If the post is found and the new information is valid:

//   - update the post document in the database using the new information sent in the `request body`.
//   - return HTTP status code `200` (OK).
//   - return the newly updated _post_.

router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if(!title || !contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post' })
    } else{
        POSTS.findById(req.params.id)
        .then(stuff => {
            if (!stuff) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                })
            } else {
                return POSTS.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if (data) {
                return POSTS.findById(req.params.id)
            }
        })
        .then(post => {
            if (post) {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an error while saving the post to the database' })
        })
    }
})

// | 5 | DELETE | remove(id) | /:id | Removes the post with the specified id and returns the **deleted post object**|

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in removing the _post_ from the database:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post could not be removed" }`.

router.delete('/:id', async (req, res) => {
    try {
        const post = await POSTS.findById(req.params.id)
        if(!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else {
            await POSTS.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({ message: 'Post could not be removed' })
    }
})

// | 6 | GET | findPostComments(postId) | /:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id|

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in retrieving the _comments_ from the database:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The comments information could not be retrieved" }`.

router.get('/:id/comments', async (req, res) => {
    try{    
        const post = await POSTS.findById(req.params.id)
        if (!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else {
            const comments = await POSTS.findPostComments(req.params.id)
            res.json(comments)
        }
    }catch(err){
        res.status(500).json({ message: 'The comments information could not be retrieved' })
    }
})

module.exports = router