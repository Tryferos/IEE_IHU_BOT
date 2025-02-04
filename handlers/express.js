const config = require("../config/config.js");
const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../server/routes.js');
require('dotenv').config()

module.exports = (client) => {

	const app = express();
	app.use(express.static('./server/public'));
	app.use(express.static('./server/views'));
	app.use(express.static('./server/model'));
	app.set('view engine', 'ejs');
	app.set('views', './server/views');
	app.use(bodyParser.urlencoded({ extended: true }));

	const PORT = config.Port || 3000;

	//Initializing routes
	app.use(routes);

	//Start the express app
	app.listen(PORT, () => {
	if (config.Status== "development") {
		console.log(`=== Website started on http://localhost:${PORT} ===`);
	} else {
		console.log(`=== Website started on ${process.env.APPS_REDIRECT_URI.split('/')[0]} ===`);
	}
	return;
});

}
