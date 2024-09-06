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

function deletePost(req, res) {
  try {
    const postId = req.params.postId;
    const postArr = jsonPosts.posts;
    const postIndex = postArr[i].id == postId;

    if (postIndex !== -1) {
      postArr.splice(postIndex, 1);
      res.status(200).json({
        message: 'Post deleted successfully'
      });
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

function updatePost(req, res) {
  try {
    const postId = req.params.postId
    const { title, content } = req.body
    const postArr = jsonPosts.posts
    const post = postArr[i].id == postId;

    if (post) {
      if (title) post.title = title
      if (content) post.content = content
      res.status(200).json({
        message: 'Post updated successfully',
        post
      })
    } else {
      res.status(404).json({
        message: 'Post not found'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error'
    })
  }
}

// get request
app.use(express.json())
app.get('/posts', getAllPostsHandler)
app.get('/posts/:postId', getPostById)
app.post('/posts', createPost)
app.patch('/posts', updatePost)
app.delete('/posts/:postId' , deletePost)


// server start
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
console.log('Server is started');