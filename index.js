const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs'); // <<<<<<< added and used for hashing

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');
const protected = require('./auth/protected.js');

const server = express();

server.use(helmet());
server.use(express.json());

server.post('/api/register', (req, res) => {
	let user = req.body;

	const hash = bcrypt.hashSync(user.password, 10);

	user.password = hash;

	Users.add(user)
		.then((saved) => {
			res.status(201).json(saved);
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

server.post('/api/login', (req, res) => {
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then((user) => {
			//
			if (user && bcrypt.compareSync(password, user.password)) {
				res.status(200).json({ message: `Welcome ${user.username}!` });
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

server.get('/api/users', protected, (req, res) => {
	Users.find()
		.then((users) => {
			res.json(users);
		})
		.catch((err) => res.send(err));
});

const port = 4000;
server.listen(port, () => console.log(`\n*** Listening on 4k ***\n`));
