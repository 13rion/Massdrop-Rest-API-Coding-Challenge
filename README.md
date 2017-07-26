# Massdrop-Rest-API-Coding-Challenge
Create a job queue whose workers fetch data from a URL and store the results in a database.  The job queue should expose a REST API for adding jobs and checking their status / results.

# Install & Run
```
$ git clone https://github.com/brion-baskerville/Massdrop-Rest-API-Coding-Challenge.git
$ cd Massdrop-Rest-API-Coding-Challenge
$ npm install
$ node server.js
```

# API
##### POST
```
localhost:8000/job
```
###### Successful Response
```
{
    "_id": "5977ddf978cd2e385d03e6e9",
    "url": "https://www.google.com",
    "status": "Pending",
    "date": "July 25 2017, 5:10:33 PM",
    "worker": 2
}
```
##### GET
```
localhost:8000/job/JOB_ID_GOES_HERE
```
###### Successful Response
```
{
    "_id": "59777147b07b5b10813042ce",
    "url": "https://www.google.com",
    "status": "Completed",
    "date": "July 25 2017, 9:26:47 AM", 
    "worker": 1,
    "html": "<!doctype html><html>...</html>"
}
```
##### DELETE
```
localhost:8000/job/JOB_ID_GOES_HERE
```
###### Successful Response
```
Job: 59777147b07b5b10813042ce deleted.
```
##### UPDATE
```
localhost:8000/job/JOB_ID_GOES_HERE
```
###### Successful Response
```
{
    "_id": "59777147b07b5b10813042ce",
    "url": "https://playoverwatch.com/en-us/career/pc/us/Skhy-1689",
    "status": "Completed",
    "date": "July 25 2017, 9:26:47 AM",
    "worker": 3,
    "html": "<!doctype html><html>...</html>"
}
```
