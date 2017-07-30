///
// MONGOCONNECT.JS
// Connects to the mongodb database.
///

//Dependencies
const MongoClient = require('mongodb').MongoClient; //Database: MongoDB. NoSQL Database.

//URL where database lies
const url = "mongodb://localhost:27017/jobs";

//References the connected database
let _db;

module.exports = {
	//Connects to the database
	//Sets _db to the connected database
	connect: ( callback ) => {
		MongoClient.connect(url, (error, db) => {
			_db = db;
			return callback(error);
		});
	},
	//Returns the _db field
	getDatabase: () => {
		return _db;
	}
};