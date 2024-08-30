const express = require('express');
const fs = require('fs');
const app = express();

console.log('Server is starting...');
const content = fs.readFileSync("post.json", "utf-8")
const jsonPosts = JSON.parse(content);


function getAllPostsHandler(req, res) {
  try {
    console.log('Recieved get Request')
    res.status(200).json(jsonPosts)
  } catch (err) {
    res.status(500).json({
      message: 'internal server error'
    })
  }
}


function getPostById(req, res) {
  try {
    const postid = req.params.postId
    console.log('postId', postid)
    const postsArr = jsonPosts.posts
    for (let i = 0; i < postsArr.length; i++) {
      if (postsArr[i].id == postid) {
        return res.status(200).json({
          post: postsArr[i]
        })
      }
    }
    res.status(404).json({
      post: 'post not found'
    })
  } catch (err) {
    res.status(500).json({
      response: 'something went wrong on our end'
    })
  }
}

function createPost(req, res) {
    try {
        console.log('req.body', req.body)
        const postArr = jsonPosts.posts
        postArr.push(req.body)
        res.status(201).json({
            message: 'post created successfully'
        })
    }catch(err){
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

// get request
app.use(express.json())
app.get('/posts', getAllPostsHandler)
app.get('/posts/:postId', getPostById)
app.get('/posts', createPost)


// server start
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
console.log('Server is started');