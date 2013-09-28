var express = require('express');
var app = express();


//Initialize server data****************************************************************************************************
//products-----------------------------------------------------------------------------------------
var products = require('./products');
var Product = products.Product;

var productList = new Array(
	new Product("shirt", "clothes:men", 19.99, "blue medium shirt", "sleeveless","","nike","medium","carlosjgm",4.99),
	new Product("hdtv", "electronics:tv", 499.99, "30 inches hd tv", "r450a","","Sony","30 inches","carlosjgm", 199.99)
);

var productNextId = 0;
 
for (var i=0; i < productList.length; ++i){
	productList[i].id = productNextId++;
}

//users---------------------------------------------------------------------------------------------
var users = require('./users');
var User = users.User;

var userList = new Array(
	new User("carlosjgm", "123", "carlosjgm@gmail.com"),
	new User("user", "user", "user@icom5016.com"),
	new User("admin", "admin", "admin@icom5016.com")
);

var userNextId = 0;
userList[0].selling.push(0);
userList[0].selling.push(1);
for (var i=0; i < userList.length; ++i){
	userList[i].id = userNextId++;
}


//server configuration----------------------------------------------------------------------------------
app.use(express.bodyParser());

app.use(function(req, res, next){
 	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	next();
});

//REST API for products**************************************************************************************************************************

//get all products------------------------------------------------------
app.get('/browse', function(req, res){
	console.log("Get all products request received.");
	res.json({"products" : productList});
});

//get product by id-----------------------------------------------------
app.get('/product/:id', function(req, res){
	console.log("Get product " + req.params.id + "request received.");
	if(productList.length <= req.params.id || req.params.id < 0){
		res.statusCode = 404;
		res.send('Error 404: No such product found.');
	}
	else{
		var id = req.params.id;
		var target = -1;
		for (var i=0; i < productList.length; ++i){
			if (productList[i].id == id){
				target = i;
				break;	
			}
		}
		if(target == -1){
			res.statusCode = 404;
			res.send('Error 404: No such product found.');
		}
		else{
			var product = productList[req.params.id];
			res.statusCode = 200;
			res.json(product);	
		}
	}	
});

//new product-------------------------------------------------
app.post('/newproduct', function(req, res) {
	console.log("Add new product request received.");
  	if(req.body.name=="" || req.body.category=="" || req.body.instantprice==""
  	|| req.body.description=="" || req.body.model == "" 
  	|| req.body.brand=="" || req.body.dimensions=="" || req.body.seller=="" || req.body.bid=="") {
		res.statusCode = 400;
		res.send('Error 400: Product form is missing fields.');
	}
	else if(req.body.instantprice < req.body.bid){
		res.statusCode = 400;
		res.send("Product instant price must be greater than bid price.");
	}
	else{
		var newProduct = new Product(req.body.name, req.body.category, req.body.instantprice, req.body.description, req.body.model,
			req.body.photo,	req.body.brand, req.body.dimensions, req.body.seller, req.body.bid);
			
		newProduct.id = productNextId++;
		newProduct.bidders.push({"username" : req.body.username, "bid" : req.body.bid});
		
		productList.push(newProduct);
		
		//add new product to selling list of seller
		var target;
		for(var i=0; i < userList.length; i++)
			if(userList[i].username == req.body.seller){
				userList[i].selling.push(productNextId - 1);
				break;
			}
			
		res.statusCode = 200;
		res.redirect(req.body.URL);
	}
});

//update product-------------------------------------------------
app.post('/product/:id', function(req, res) {
	console.log("Update product " + req.params.id + "request received.");
	if (productList.length <= req.params.id || req.params.id < 0){
		res.statusCode = 404;
		res.send("Error 404: No such product found.");
	}
	
  	else if(req.body.name=="" || req.body.category=="" || req.body.instantprice==""
  	|| req.body.description=="" || req.body.model == "" || req.body.photo==""
	|| req.body.brand=="" || req.body.dimensions=="" || req.body.seller=="") {
		res.statusCode = 400;
		res.send('Error 400: Product form is missing fields.');
	}
	
	else{
		var id = req.params.id;
		var target = -1;
		for (var i=0; i < productList.length; ++i){
			if (productList[i].id == id){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("Error 404: No such product found.");			
		}	
		else {	
			var theproduct = productList[target];
			theproduct.name = req.body.name;
			theproduct.category = req.body.category;
			theproduct.instantprice = req.body.instantprice;
			theproduct.description = req.body.description;
			theproduct.model = req.body.model;
			theproduct.photo = req.body.photo;
			theproduct.brand = req.body.brand;
			theproduct.dimensions = req.body.dimensions;
			theproduct.seller = req.body.seller;
			res.statusCode = 200;
			res.redirect(req.body.URL);
		}
	}
});

//delete product by id-------------------------------------------------------
app.del('/product/:id', function(req, res) {
	console.log("Delete product " + req.params.id + "request received.");
	if(productList.length <= req.params.id || req.params.id < 0) {
		res.statusCode = 404;
		res.send('Error 404: No such product found');
	}
	else{
		var id = req.params.id;
		var target = -1;
		for (var i=0; i < productList.length; ++i){
			if (productList[i].id == id){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("Error 404: No such product found.");			
		}	
		else {	
			var removed = productList.splice(req.params.id, 1);
			res.statusCode = 200;
			res.json({"product" : removed});
		}
	}
});


//REST API for users**************************************************************************************************************************
//user login-------------------------------------------------
app.post("/login", function(req, res){
	console.log("Login request from " + req.body.username + " received.");
  	if(req.body.username == "" || req.bodypassword == ""){
		res.statusCode = 400;
		res.send('Error 400: The form has missing fields.');
	}
	else{
		var target = -1;
		for (var i=0; i < userList.length; ++i){
			if (userList[i].username == req.body.username){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 400;
			res.send("Error 400: Username/password entered not valid.");			
		}	
		else if(userList[target].password == req.body.password) {	
			res.statusCode = 200;
			res.redirect(req.body.URL);
		}
		else{
			res.statusCode = 400;
			res.send("Error 400: Username/password entered not valid.");
		}
	}
});

//user register-------------------------------------------------
app.post("/register", function(req, res){
	console.log("Registration request received for " + req.body.newusername);
  	if(req.body.newusername == "" || req.body.newpassword == "" || req.body.newemail == ""){
		res.statusCode = 400;
		res.send('Error 400: The form has missing fields.');
	}
	else {
		
		var useravailable = true;
		var emailavailable = true;
		for (var i=0; i < userList.length; i++){
			if(userList[i].username == req.body.newusername){
				useravailable = false;
				break;	
			}
			if(userList[i].email == req.body.newemail){
				emailavailable = false;
				break;
			}
		}
		
		if(!useravailable){
			res.statusCode = 400;
			res.send("Username not available.");
		}
		
		else if(!emailavailable){
			res.statusCode = 400;
			res.send("Email already in use.");
		}
		
		else{
			var newUser = {
			id : userNextId++,
			username : req.body.newusername,
			password : req.body.newpassword,
			email : req.body.newemail
			};
			
			userList.push(newUser);
			
			res.statusCode = 200;
			res.json(true);
		}
	}
});

//password reset-------------------------------------------------
app.post("/reset", function(req, res){
	console.log("Reset request received for " + req.body.resetemail);
  	if(req.body.resetemail == ""){
		res.statusCode = 400;
		res.send('Error 400: The form has missing fields.');
	}
	else{
		var target = -1;
		for (var i=0; i < userList.length; i++){
			if(userList[i].email == req.body.resetemail){
				target = i;
				break;
			}
		}
		
		if(target == -1){
			res.statusCode = 404;
			res.send("Error 404: No such email found.");
		}
		
		else{
			var user = userList[target];
			res.statusCode = 200;
			res.send("Username: " + user.username + "<br />Password: " + user.password);
		}
	}
	
});

//user profile-------------------------------------------------
app.get("/user/:username", function(req, res){
	console.log("Get " + req.params.username + " request received.");
	
	var target = -1;
	for (var i=0; i < userList.length; i++){
		if(userList[i].username == req.params.username){
			target = i;
			break;	
		}
	}
	
	if(target == -1){
		res.statusCode = 404;
		res.send('Error 404: No such user found.');
	}
	else{
		res.statusCode = 200;
		res.json(userList[target]);	
	}	
});

//user product methods****************************************************************************8
//bid on item-------------------------------------------------------------
app.post("/bid/:id", function(req, res){
	console.log("Bid on item " + req.params.id);
	
	if(productList.length <= req.params.id || req.params.id < 0){
		res.statusCode = 404;
		res.send('Error 404: No such product found.');
	}
	else{
		//find item being bidded on
		var id = req.params.id;
		var target = -1;
		for (var i=0; i < productList.length; ++i){
			if (productList[i].id == id){
				target = i;
				break;	
			}
		}
		
		if(target == -1){
			res.statusCode = 404;
			res.send('Error 404: No such product found.');
		}
		else if(productList[target].nextbidprice >= req.body.bid){
			console.log("request bid price: " + req.body.bid);
			res.statusCode = 400;
			res.send('Error 400: Bid price must be higher than $' + productList[target].nextbidprice + '.');
		}
		else{
			var item = productList[target];
			
			//update nextbid price
			item.nextbidprice = req.body.bid;
			
			//is it a bid from a new user?
			target = -1;
			for(var i=0; i < item.bidders.length; i++){
				if(item.bidders[i].username == req.body.username){
					target = i;
					break;
				}
			}
			//new bidder, add him to bidder list and add item to user bids
			if(target == -1){
				//add new user to the bidder list of the item				
				item.bidders.push({"username" : req.body.username, "bid" : req.body.bid});
				
				//add item to the bidding list of the user
				for(var i=0; i < userList.length; i++){
					if(userList[i].username == req.body.username){
						userList[i].bidding.push({"id" : id, "bid" : req.body.bid});
						break;
					}
				}
				res.statusCode = 200;
				res.send('New bid accepted.');
			}
			//previous bidder, update bid
			else{
				//update bid price of user
				item.bidders[target].bid = req.body.bid;
				
				//update bid price in the bidding list of the user
				for(var i=0; i < userList.length; i++){
					if(userList[i].username == req.body.username)
						for(var j=0; j < userList[i].bidding.length; j++)
							if(userList[i].bidding[j].id == id){
								userList[i].bidding[j].bid = req.body.bid;
								break;
							}				
				}
				res.statusCode = 200;
				res.send('Bid updated.');
			}
		}
	}
	
});

console.log("Server started. Listening on port 8888.");
app.listen(process.env.PORT || 8888);