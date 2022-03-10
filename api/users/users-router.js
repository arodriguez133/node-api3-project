const express = require('express');
const users = require('./users-model');
const posts = require('../posts/posts-model');
const {validateUserId,validateUser,validatePost} = require('../middleware/middleware')


// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
    users.get(req.query)
    .then((user) => {
      res.status(200).json(user)
    })
    .catch(next);
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  res.json(req.user);
  // this needs a middleware to verify user id
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
        users.insert(req.body)
        .then((user)=> {
          res.status(201).json(user)
        })
        .catch(next)
  // this needs a middleware to check that the request body is valid
});

router.put('/:id',validateUserId, validateUser, (req, res, next) => {
  users.update(req.params.id, {name: req.name})
  .then(()=> {
    return users.getById(req.params.id)
  })
  .then((user)=>{
    res.json(user)
  })
  .catch(next);
});

router.delete('/:id',validateUserId, async (req, res, next) => {
  try{
   let result = await users.remove(req.params.id)
   res.json(result);
  }
  catch(err){
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try{
    const result = await users.getUserPosts(req.params.id);
    res.json(result);
  }
  catch(err){
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try{
     const result = await posts.insert({
       user_id: req.params.id,
       text: req.text,
     })
     res.status(201).json(result);
  }
  catch(err){
    next(err)
  }
});

// do not forget to export the router
module.exports = router;

router.use((err, req, res, next)=> {
  res.status(err.status || 500).json({
    custom: 'something went wrong in the users router',
    message: err.message,
    stack: err.stack,
  })
})
