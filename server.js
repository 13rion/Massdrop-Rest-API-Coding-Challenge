///
// SERVER.JS
// Main file that starts the application.
// Lists the needed dependencies, sets the port, connects to the database, and starts the app.
///

var cluster = require('cluster');

//Cluster - Master Process
if(cluster.isMaster) {
	//System CPUs
	var cpuCount = require('os').cpus().length;

	//Worker foreach CPU
	for(var i = 0; i < cpuCount; i += 1) {
		cluster.fork();
	}

	//Create another worker if a worker dies
	cluster.on('exit', (worker) => {
		console.log('Worker ' + worker.id + ' died.')
		cluster.fork();
	});

//Cluster - Worker Process
} else {
	//Dependencies
	var express 		= require('express'), //Framework: Express
		mongoConnect	= require('./db/mongoConnect'), //Database: MongoDB. NoSQL Database.
		bodyParser 		= require('body-parser'); //Parser: Body Parser. Parse data sent to the DB.
		
	var app = express();

	//Port to listen on
	var port = 8000;

	//Parse data
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	mongoConnect.connect( (error) => {
		if(error) return console.log(error);
		
		require('./router/routes.js')(app);

		//Tell the app to listen on the specified port
		app.listen(port, () => {
			// console.log('App is listening on ' + port);
			console.log('Worker ' + cluster.worker.id + ' is running.');
		});
	});
}