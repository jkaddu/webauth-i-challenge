const express = require('express');
const helmet = require('helmet');

const userRouter = require('./router/userRouter.js');
const loginRouter = require('./router/loginRouter');
const registerRouter = require('./router/registerRouter');

const server = express();

server.use(helmet());
server.use(express.json());

server.use('/api/user', userRouter);
server.use('./api/login', loginRouter);
server.use('./api/register', registerRouter);

module.exports = server;
