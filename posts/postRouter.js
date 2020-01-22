const express = require('express');

const router = express.Router();

const Post = require('./postDb');





router.get('/', (req, res) => {
  Post.get()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." });
        })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  Post.remove(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({error: "The post could not be removed"});
    })
});

router.put('/:id', validatePostId, validateUser, (req, res) => {
  const updatePost = req.body;

  Post.update(req.params.id, updatePost)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
        res.status(500).json({error: "The post information could not be modified"});
    })
});


// custom middleware

function validatePostId(req, res, next) {
  const {id} = req.params;
  Post.getById(id)
    .then(post => {
      if(post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }   
    })
    .catch(err => {
      res.status(500).json({message: 'exception error'});
    })
}

function validateUser(req, res, next) {
  const postData = req.body;
  if(!postData) {
    res.status(400).json({ message: "missing user data" });
  } else if (!postData.text) {
    res.status(400).json({ message: 'missing required text field'})
  } else {
    next();
  }
}

module.exports = router;
