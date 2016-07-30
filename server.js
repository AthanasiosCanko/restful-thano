var express = require('express'), bodyParser = require('body-parser'), MongoClient = require('mongodb').MongoClient;

var app = new express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect("mongodb://athanasios:canko@ds031835.mlab.com:31835/rest-thano", function(err, db) {
	if (err) console.log(err);
	else console.log("Database connected...");
	
	var collection = db.collection("users");

	app.get("/item", function(req, res) {

		var read = function() {
			collection.find().toArray(function(err, data) {
				if (err) console.log(err);
				else {
					console.log("All users displayed.");
					res.status(200).json(data);
				}
			});
		};
	
		read();
	});

	app.post("/item", function(req, res) {
	
		var create = function(name) {
		
			var user = {
				name: name
			};
		
			collection.insert(user, function(err) {
				if (err) console.log(err);
				else {
					console.log("User added.");
					res.status(200).json({success: "Success!"});
				}
			});
		};
	
		create(req.body.item);
	});

	app.put("/item", function(req, res) {
	
		var update = function(original, update) {
			var user = {
				name: original
			};
		
			var updatedUser = {
				name: update
			};
		
			collection.findAndModify(user, null, updatedUser, function(err) {
				if (err) console.log(err);
				else {
					console.log("User updated.");
					res.status(200).json({success: "Success!"});
				}
			});
		};
	
		update(req.body.original, req.body.update);
	});

	app.delete("/item", function(req, res) {
		var del = function() {
			collection.remove();
			console.log("Users removed.");
			res.status(200).json({success: "Success!"});
		};
	
		del();
	});	
});

app.listen(process.env.PORT || 9000, function(err) {
	if (err) console.log(err);
	else console.log("Connected to port 9000...");
});