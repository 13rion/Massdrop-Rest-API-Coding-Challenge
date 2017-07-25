///
// CONTROLLER.JS
// Functions for each HTTP method, controls the data going into and out of the database.
///

//Dependencies
var mongoConnect	= require('./mongoConnect.js'),
	moment 			= require('moment'),
	request 		= require('request-promise-native'),
	valid			= require('valid-url'),
	ObjectID		= require('mongodb').ObjectID;

var cluster = require('cluster');

//Jobs database
var jobs = mongoConnect.getDatabase().collection('jobs');

/**
 * GET
 *
 * Retrieves a job given the job ID
 */
exports.get = (req, res) => {
	const id = req.params.id;
	var data = { '_id' : new ObjectID(id) };
	jobs.findOne(data, (error, item) => {
		if(error) {
			res.status(500).send({ error: 'An internal server error has occured.' });
		} else {
			item.worker = cluster.worker.id;
			res.send(item);
		}
	});
}

/**
 * DELETE
 *
 * Deletes a job given the job ID
 */
exports.delete = (req, res) => {
	const id = req.params.id;
	var data = { '_id' : new ObjectID(id) };
	jobs.remove(data, (error, item) => {
		if(error) {
			res.status(500).send({ error: 'An internal server error has occured.' });
		} else {
			res.send('Job: ' + id + ' deleted.');
		}
	});
}

/**
 * PUT
 *
 * Updates a pending job given the job ID and a URL
 */
exports.put = (req, res) => {
	const id = req.params.id;
	var data = { '_id' : new ObjectID(id), 'status' : 'Pending' };
	var job = { url: req.body.url };
	jobs.update(data, job, (error, result) => {
		if(error) {
			res.status(500).send({ error: 'An internal server error has occured.' });
		} else {
			res.send(job);
		}
	});
}

/**
 * POST
 *
 * Creates a job given a URL
 * Returns a job id
 * Retrieves the URL HTML and updates the job with HTML content
 */
exports.post = (req, res) => {
	if (!valid.isUri(req.body.url)) return res.status(400).send({ error: 'Invalid URL: ' + req.body.url });
	var date = moment().format('MMMM DD YYYY, h:mm:ss A');

	var data = { 
		url: req.body.url,
		status: 'Pending',
		date: date
	}

	res.send({'worker' : cluster.worker.id});

	// jobs.insert(data, (error, result) => {
	// 	if(error) {
	// 		res.status(500).send({ error: 'An internal server error has occured.' });
	// 	} else {
	// 		res.send({'job id':result.ops[0]._id});
			
	// 		request(data.url)
	// 		.then( (html) => {
	// 			data.status = 'Completed';
	// 			data.html = html;
	// 			jobs.update({'_id':result.ops[0]._id}, data, (error, result) => {
	// 				if(error) res.status(500).send({ error: 'An internal server error has occured.' });
	// 			});
	// 		});
	// 	}
	// });
}