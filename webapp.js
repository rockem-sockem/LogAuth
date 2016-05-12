/** Server **/

var express = require('express');
var mongodb = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var assert = require('assert'); // Unit Testing
var passwordHash = require('password-hash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();
var app_port = 3000;
var db_url = 'mongodb://localhost/appdb';
var db;

app.use(bodyParser.json());
app.use(express.static('static'));
app.use(session({
	secret: 'K33p1tS3cr3t',
	//cookie: { maxAge: 2628000000 },
	store: new MongoStore({
		url: db_url,
		collection: 'mySessions',
	}),
	resave: false,
	saveUninitialized: true
}));

// Sends back the user's role from the session
app.post('/api/getRole', function(req, res) {
	res.json({"role": req.session.role});
});

// Inserts a user into the "users" collection db
// user: username, password, role
// @param {req} form.username, form.password
app.post('/api/signup/', function(req, res) {
	var username = { "username" : req.body.username };
	var newUser = {
		"username" : req.body.username,
		"password" : passwordHash.generate(req.body.password),
		"role" : "user"
	}; 
	// Checking if there's duplicate username
	db.collection("users").find(username).next(function(err, doc) {
		assert.equal(null, err);
		if(doc == null) { // Valid user
			// Inserting the user into the database
			db.collection("users").insertOne(newUser, function(err, doc) {
				assert.equal(null, err);
				res.json(newUser);
			});
		} else { // null => found duplicate
			res.json(null);
		}
	});
	
});

// Checks if the username and password is in the database and logs the user in 
// if its in the database.
// @param {req} form.username, form.password
app.post('/api/login/', function(req, res) {
	var username = req.body.username;
	var username_query = { "username" : username};
	
	db.collection("users").find(username_query).next(function(err, doc) {
		assert.equal(null, err);
		if(doc != null && passwordHash.verify(req.body.password, doc.password)) {
			req.session.username = doc.username;
			req.session.role = doc.role;
			res.json(doc);
		} else {
			res.json(null); // No username found or password does not match
		}
		
	});
});

// Logs out the logged user and destroys the session
app.post('/api/logout',function(req,res){
	req.session.destroy();
	res.end();
});

// Relogs an user that hasn't logout and it's in the session
app.post('/api/relog', function(req, res) {
	var session = {
		"username": req.session.username,
		"role": req.session.role
	};
	if(req.session.username != null) {
		res.json(session);
	} else {
		res.json(null);
	}	
});
	
// Connecting to the database
mongodb.connect(db_url, function(err, dbConnection) {
	assert.equal(null, err);
	db = dbConnection;	
	// Starting the server
	var server = app.listen(app_port, function() {
		console.log('> Application listening on port ' + app_port + '!');
	});
});
