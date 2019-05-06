const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
	client: 'sqlite3',
	connection: {
		filename: '/data/auth.db3'
	},
	useNullAsDefault: true
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
	db('users')
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

module.exports = router;
