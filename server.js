const express = require('express');

const userRouter = require('./users/userRouter');

const postRouter = require('./posts/postRouter')

const server = express();

server.use(express.json());

server.use('/api/user', userRouter);
server.use('/api/post', postRouter);

server.use(logger);

server.get('/', (req, res) => {
  const messageOfTheDay = process.env.MOTD;
  res.send().json({motd: messageOfTheDay});
});

//custom middleware

function logger(req, res, next) {
  console.log(`method: ${req.method}, ${req.url}, ${new Date().toLocaleString()} `);
  next();
}



module.exports = server;
