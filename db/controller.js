///
// CONTROLLER.JS
// Functions for each HTTP method, controls the data going into and out of the database.
///

//Dependencies
const 	mongoConnect	= require('./mongoConnect'),
		Queue 			= require('bull'),
		cluster 		= require('cluster'),
		moment 			= require('moment'),
		request 		= require('request-promise-native'),
		valid			= require('valid-url'),
		ObjectID		= require('mongodb').ObjectID;

//Variables
const 	sendQueue 	= new Queue('jobs'), //Job Queue
		db 			= mongoConnect.getDatabase().collection('jobs'); //Job database

/**
 * GET
 *
 * Retrieves a job given the job ID
 */
exports.get = (req, res) => {
	const 	id 		= req.params.id,
			query 	= { '_id' : new ObjectID(id) };

	db.findOne(query)
		.then( (result) => {
			result.serverworker = cluster.worker.id;
			res.send(result);
		},
		(error) => {
			res.status(500).send({ error: 'An internal server error has occured.' });
		});
}

/**
 * DELETE
 *
 * Deletes a job given the job ID
 */
exports.delete = (req, res) => {
	const 	id 		= req.params.id,
			query 	= { '_id' : new ObjectID(id) };

	db.findOneAndDelete(query)
		.then( (result) => {
			if(result.value) {
				result.value.serverworker = cluster.worker.id;
				res.send(result.value);
			} else {
				res.send({ error: 'Cannot delete document.' });
			}
		},
		(error) => {
			res.status(500).send({ error: 'An internal server error has occured.' });
		});
}

/**
 * PUT
 *
 * Updates a pending job given the job ID and a URL
 */
exports.put = (req, res) => {
	if (!valid.isUri(req.body.url)) return res.status(400).send({ error: 'Invalid URL: ' + req.body.url });

	const 	id 		= req.params.id,
		 	query 	= { '_id' : new ObjectID(id), 'status' : 'Pending' },
			set 	= { $set: {url: req.body.url } },
			opts	= { returnOriginal : false };

	db.findOneAndUpdate(query, set, opts)
		.then( (result) => {
			if(result.value) {
				result.value.serverworker = cluster.worker.id;
				res.send(result.value);
			} else {
				res.send({ error: 'Cannot update document.' });
			}
		},
		(error) => {
			res.status(500).send({ error: 'An internal server error has occured.' });
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

	const doc = { 
		url: req.body.url,
		status: 'Pending',
		date: moment().format('MMMM DD YYYY, h:mm:ss A')
	}
	
	db.insert(doc)
		.then( (result) => {
			result.ops[0].serverworker = cluster.worker.id;
			res.send(result.ops[0]);
			return { id : result.ops[0]._id, url : result.ops[0].url };
		},
		(error) => {
			res.status(500).send({ error: 'An internal server error has occured.' });			
		})
		.then( (result) => {
			sendQueue.add(result, { jobId : result.id });
		});
}