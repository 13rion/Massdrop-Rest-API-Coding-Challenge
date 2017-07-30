///
// WORKER.JS
///

//Dependencies
const   Queue           = require('bull'),
        cluster         = require('cluster'),
        mongoConnect    = require('./../db/mongoConnect'),
        request         = require('request-promise-native'),
        ObjectID        = require('mongodb').ObjectID;

//Variables
const   numOfWorkers = 8, //Number of workers to deploy
        receivedJobs = new Queue("jobs"); //Jobs sent by a POST request

//Master
if(cluster.isMaster) {
    for (let i = 0; i < numOfWorkers; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log(`Queue Worker ${worker.id} died`);
        cluster.fork();
    });
//Workers
} else {
    console.log(`Queue Worker ${cluster.worker.id} is running`);
    //Connect to DB
    mongoConnect.connect( (error) => {
        if(error) return console.log(error);
        
        const   db      = mongoConnect.getDatabase().collection('jobs'), //Get Jobs Database
                maxSize = 1048576; //Max Size: 1MB

        //Process Job
        receivedJobs.process(function(job, done) {
            //Variables
            let response    = request(job.data.url), //Get HTML
                size        = 0; //Data Size

            response.on('data', (data) => {
                size += data.length;
                if (size > maxSize) {
                    console.log(`Resource stream exceeded limit (${size})`);
                    response.abort();
                }
            })
            .then( (html) => {
                //Query for ID
                //Update document with completed status and HTML content 
                const   query   = { '_id' : new ObjectID(job.data.id) },
                        set     = { $set: { status: 'Completed', html } };

                db.update(query, set)
                    .then( (result) => {
                        console.log(`Job ${job.id} done by Queue Worker ${cluster.worker.id}`);
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