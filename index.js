const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs'); // <<<<<<< added and used for hashing
const session = require('express-session'); // <<<<<<<< added for sessionConfig

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');
const protected = require('./auth/protected.js');

const server = express();

const sessionConfig = {
	name: 'coded',
	secret: 'kept secret, keep it guarded! Teacher',
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 1,
		secure: false
	},
	resave: false,
	saveUninitialized: true
};

server.use(session(sessionConfig));
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
				res.session.username = user.username;
				res.status(200).json({ message: `Welcome ${user.username}, here's a cookie!` });
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

router.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.send('Whoops.');
			} else {
				res.send('Bye');
			}
		});
	} else {
		res.send('Already logged out.');
	}
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
