const express = require('express');

const router = express.Router();

const User = require('./userDb.js');


const userPostId = require('../posts/postDb');




router.post('/', validateUser, (req, res) => {
  const newUser = req.body;

  // if(!newUser.name) {
  //   res.status(400).json({errorMessage: "Please provide a name"});
  // } else {
    User.insert(newUser)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => {
        res.status(500).json({ error: "There was an error while saving the user to the database" });
      })
  // }
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
 
  const postInfo = { ...req.body, user_id: req.params.id };

    userPostId.insert(postInfo)
      .then(comment => {
        res.status(201).json(comment)
      })
      .catch(err => {
        res.status(500).json({ error: "There was an error while saving the user to the database" });
        console.log(err);
      })
});

router.get('/', (req, res) => {
  User.get()
        .then(posts => {
            const messageOfTheDay = process.env.MOTD;
            res.status(200).json(messageOfTheDay);
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." });
        })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  User.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500.).json({ message: "The post with the specified ID does not exist." })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({error: "The post could not be removed"});
    })

});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const updateUser = req.body;

  User.update(req.params.id, updateUser)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({error: "The post information could not be modified"});
    })

});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;
  User.getById(id)
    .then(user => {
      if(user) {
        req.user = user;
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
  const userData = req.body;
  if(!userData) {
    res.status(400).json({ message: "missing user data" });
  } else if (!userData.name) {
    res.status(400).json({ message: 'missing required name field'})
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const postData =  req.body;
  if(!postData) {
    res.status(400).json({ message: "missing user data" });
  } else if (!postData.text) {
    res.status(400).json({ message: 'missing required name field'})
  } else {
    next();
  }
}

module.exports = router;

