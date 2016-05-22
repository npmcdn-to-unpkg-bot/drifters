const Hapi = require('hapi');
var credentials = require('./credentials');
//database
const mysql = require('mysql');
const dbcon = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: credentials.DATABASEPASSWORD,
	database: 'drifters'
});

//conf
//server conf
var server = new Hapi.Server();
server.connection({
	host: 'localhost',
	port: 3000
});
dbcon.connect();

//Make routes
var routeMaker = require('./routes');
routeMaker.configRoutes(server, dbcon);

//start basic server
server.start(function(){
	console.log('Server running at: ', server.info.uri);
});