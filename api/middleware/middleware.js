const users = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
    '/'
  )}`);
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  users.getById(req.params.id)
  .then((user)=> {
    if(user){
      req.user = user;
      next(); 
    }else{
      next({
        status: 404,
        message: 'user not found'
      })
    }
  })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if(req.body.name && req.body.name.trim()){
    req.body.name = req.body.name.trim();
    next();
  }else{
    next({
      status: 400,
      message: 'missing required name field',
    })
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const {text} = req.body
  if(!text || !text.trim){
    res.status(400).json({
      message: 'missing required text field',
    })
  }else{
    req.text = text.trim()
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}