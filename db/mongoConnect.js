///
// MONGOCONNECT.JS
// Connects to the mongodb database.
///

//Dependencies
var MongoClient = require('mongodb').MongoClient; //Database: MongoDB. NoSQL Database.

var _db, //References the connected database
	url = "mongodb://localhost:27017/jobs"; //URL where database lies

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