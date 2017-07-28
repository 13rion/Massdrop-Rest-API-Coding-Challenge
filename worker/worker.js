///
// WORKER.JS
///

//Dependencies
var Queue = require('bull'),
    cluster = require('cluster'),
    mongoConnect    = require('./../db/mongoConnect'),
    request         = require('request-promise-native'),
    ObjectID        = require('mongodb').ObjectID;

//Number of workers to deploy
var numOfWorkers = 8;
//Jobs sent by a POST request
var receivedJobs = new Queue("jobs");

//Master
if(cluster.isMaster) {
    for (var i = 0; i < numOfWorkers; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.id + ' died');
        cluster.fork();
    });
//Workers
} else {
    console.log('Queue Worker ' + cluster.worker.id + ' is running');
    //Connect to DB
    mongoConnect.connect( (error) => {
        if(error) return console.log(error);

        //Get Jobs Database
        var db = mongoConnect.getDatabase().collection('jobs');
        //Process Job
        receivedJobs.process(function(job, done) {
            //Get HTML
            request(job.data.url)
            .then( (html) => {
                //Query for ID
                //Update document with completed status and HTML content 
                var query = { '_id' : new ObjectID(job.data.id) },
                    set = {
                    $set: {
                        status: 'Completed',
                        html: html
                    }
                }
                db.update(query, set)
                    .then( (result) => {
                        console.log("Job " + job.id + " done by Queue Worker", cluster.worker.id);
                        done(); //Job is done
                    },
                    (error) => {
                        console.log(error);
                        done(new Error('Error Updating Document'));
                    });
            });
        });
    });
}