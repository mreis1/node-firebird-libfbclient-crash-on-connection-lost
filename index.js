var fb = require('firebird');
var fs = require('fs');
var express = require('express');
var uncaughtHandler = require('uncaught-exception');
var password = process.env['FB_PASSWORD'];
var user = process.env['FB_USER'];
var db = process.env['FB_DB'];
var tx;
var path = require('path');
console.log(db, user, password)

var con;

connect();
function connect(){
    try {
        console.log('Trying to connect');
        con = fb.createConnection();
        con.connect(db, user, password,'', function(err){
            console.log(err ? 'Error' : 'Success');
            if (err) return ;
            tx = con;
        });    
    } catch (err){
        console.log('Failed to connect...', err.message);
    }
    
}


var app = express();

app.get('/', function(req, res){
	tx.query('SELECT FIRST 1 CLI_ID from CLIENTS', function(err, qres){
        console.log(tx);
		if (err){ 
            try {
                tx.disconnect();
            } catch(err){
                console.log('Error disconnecting: ' + err.message)
            }
			
            console.log('....' + err.message);
			
			
			res.status(500).json({err: err.message})
            
            con = null;
            connect();
            return ;
		}
		let results = [];
		qres.fetch('all', true, (row)=>{
			results.push(row);
		}, ()=>{
			res.json(results);
		})
	})
})

app.listen(8080);




var myLogger = {
    fatal: function fatal(message, metaObj, callback) {
        // must call the callback once logged
        console.log('fatal', arguments)
    }
}
var myStatsd = {
    immediateIncrement: function inc(key, count, callback) {
        // call the callback once incremented.
        console.log('immediateIncrement', arguments)
    }
}

var onError = uncaughtHandler({
    logger: myLogger,
    statsd: myStatsd,
    meta: { 'hostname': require('os').hostname() },
    abortOnUncaught: false, // opt into aborting on uncaught
    backupFile: path.join(__dirname,'/uncaught-handler.log' ),
    gracefulShutdown: function (callback) {
        // perform some graceful shutdown here.
        console.log('gracefulShutdown');
        // for example synchronize state of your app to redis
        // for example communicate to master process in cluster
        // and ask for a new worker to be started

        // must call callback once gracefully shutdown
        // after you call the callback the process will shutdown
    }
})

process.on('uncaughtException', onError)