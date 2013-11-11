var express = require('express');
var app = express();
var pg = require('pg');

// Database connection string: pg://<username>:<password>@host:port/dbname 
var conString = "pg://postgres:123@localhost:5432/icom5016";

//Initialize server data****************************************************************************************************
//products-----------------------------------------------------------------------------------------
var products = require('./appjs/products');
var Product = products.Product;


//Product(name, category, instantprice, description, model, photo, brand, dimensions, seller, nextbidprice)
var productList = new Array(
	new Product("Awesome Toothbrush", "sports-bicycle-parts", 4.00, "A cool toothbrush I don't use anymore", "XF-5000", "http://diyhealth.com/wp-content/uploads/2013/04/used-toothbrush_64.jpg", "Colgate", "0.5'x7'x0.5'","susyspider",0.99),
	new Product("Some Crappy Cologne", "sports-fishing", 6.00, "I got this for my birthday, but I don't really like how it smells", "My Little Pony for Him", "http://thatgirlything.files.wordpress.com/2011/09/pherlure_pheromone_perfume.jpg", "Avon", "2'x4'x3'", "susyspider", 0.99),
	new Product("5 Slices of Bread", "shoes-children", 1.00, "I bought these at Walgreens but I'm leaving for New Zealand in two days and I don't want to throw them out", "Integral", "http://us.123rf.com/400wm/400/400/lodka/lodka0908/lodka090800017/5629798-five-slices-of-rye-bread-on-a-white-plate.jpg", "Pan Pepin", "6'x6'x12'", "susyspider", 0.99),
	new Product("Broken Heart Pinata", "sports-bicycle-frames", 7.00, "A nice heart-shaped pinata that we used for some party. It got hit several times so it's now broken but if you have glue at home you can fix it and it'll be like new", "XF-5000", "http://images.fineartamerica.com/images-medium-large/my-heart-is-a-pinata-amy-s-turner.jpg", "Pinatas R Us", "24'x12'x36'", "susyspider", 0.99),
	new Product("Muddy Shoes", "shoes-women", 2.00, "A pair of sneakers I wore when hiking at some exotic rainforest in Puerto Rico. They got all muddy and I'm too lazy to clean them so I want to sell them, but they are cool shoes when they are clean", "GPS", "http://www.crossfitwillcounty.biz/files/2013/02/muddy-shoes_132039153.jpg", "Converse", "'x7'x0.5'", "susyspider", 0.99)	
);

//users---------------------------------------------------------------------------------------------
var users = require('./appjs/users');
var User = users.User;
var addresses = require('./appjs/address');
var Address = addresses.Address;

//User(username, password, email, avatar, fname, lname)
var userList = new Array(
	new User("carlosjgm", "123", "carlosjgm@gmail.com","https://1.gravatar.com/avatar/a233505ac10fa50960aa0ebda04a23de?d=https%3A%2F%2Fidenticons.github.com%2F30ec72c3236786979cfee2cd1c44f026.png&s=420","Carlos", "Gomez"),
	new User("susyspider", "456", "susy@spider.com", "https://0.gravatar.com/avatar/5cd0cbb1047736241484fcc0c7743c59?d=https%3A%2F%2Fidenticons.github.com%2F2025acdb9222d589321cad8cefaca448.png&s=420","Susana", "Galicia"),
	new User("randaniel", "789", "randaniel@me.com", "https://1.gravatar.com/avatar/fb1d5443d879248bedfe1487ccfb6f49?d=https%3A%2F%2Fidenticons.github.com%2F9b3e1ccb2bef33b4a015f82068291a75.png", "Randy", "Soto"),
	new User("user", "user", "user@icom5016.com", "http://th05.deviantart.net/fs71/PRE/f/2012/191/6/0/no_face_wants_a_hug_by_shiriisy-d56qc10.png", "No", "Face"),
	new User("admin", "admin", "admin@icom5016.com", "http://th05.deviantart.net/fs71/PRE/f/2012/191/6/0/no_face_wants_a_hug_by_shiriisy-d56qc10.png", "Noh", "Face")
);

var userNextId = 0;
for (var i=0; i < userList.length; ++i){
	userList[i].id = userNextId++;
}

var productNextId = 0;
for (var i=0; i < productList.length; ++i){
	productList[i].id = productNextId++;
	userList[1].selling.push(i);
}

//credit card users----------------------------------------------------------------------------------------

var cards = require('./appjs/creditcards');
var creditCards = cards.creditCards; 

//cCardUsers(id, holdername, carnum, ccv, expday, expmonth, expyear) relationship table
var cCardUsers = new Array(
	new creditCards("0", "Carlos J. Gomez", "1234123412341234", "123","1","2014"),
	new creditCards("1", "Susana C. Galicia", "4567456745674567", "456", "4", "2014"),
	new creditCards("1", "Susana C. Galicia", "4567456745674568", "456", "4", "2014"),
	new creditCards("2", "Randy Soto", "7890789078907890", "789", "7", "2014")
);

//users with addresses----------------------------------------------------------------------------------------
var allAddresses = require('./appjs/address');
var Address = allAddresses.Address; 

//Address(id,line1,line2,city,country,zipcode,state)
var addresses = new Array(
	new Address("0", "Some street 1", "Some street 2", "Cabo Rojo", "Puerto Rico", "00680", "Puerto Rico"),
	new Address("1", "Some street 1", "Some street 2", "San German", "Puerto Rico", "00683", "Puerto Rico"),
	new Address("2", "Some street 1", "Some street 2", "Mayaguez", "Puerto Rico", "00682", "Puerto Rico")
);

//sales----------------------------------------------------------------------------------------
var sales = require('./appjs/sales');
var Sale = sales.Sale;

//Sale(name, category, revenue, seller, buyer, date, photo)
var salesList = new Array(
	new Sale("Alice in Wonderland", "books-children", 15, "carlosjgm", "user", new Date(), 'http://g-ecx.images-amazon.com/images/G/01/ciu/3a/67/ba0d90b809a064d76bbc6110.L._SY300_.jpg', 1),
	new Sale("pokemon tshirt", "clothing-children", 90, "carlosjgm", "susyspider", new Date(2003,5,17), 'http://ecx.images-amazon.com/images/I/41X39Cf26rL._SL246_SX190_CR0,0,190,246_.jpg', 10)
);

var saleNextId = 0;
for (var i=0; i < salesList.length; ++i){
	salesList[i].id = saleNextId++;
	userList[1].sales.push(i);
}

//server configuration----------------------------------------------------------------------------------

app.use(express.bodyParser());

app.use(function(req, res, next){
 	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	next();
});

/*
 * REST API for credit cards*********************************************************************************************************************
 */

//Create new credit card
app.post("/newcard/:id", function(req, res){
	console.log("Add new card request received from user with id " + req.params.id);

  	if(req.body['card-holder-name'] == "" || req.body['card-num'] == "" || req.body.ccv == "" || req.body['select-choice-month'] == "Month" || req.body['select-choice-year'] == "Year"){
		res.statusCode = 400;
		res.send('Error 400: The form has missing fields.');
	}
	
	else if(req.body['card-num'].length != 16 || req.body.ccv.length != 3){
			res.statusCode = 400;
			res.send('Error 400: Fields have invalid format.');
	}
	
	else {
		
		var client = new pg.Client(conString);
		client.connect();
		
		var query = client.query("SELECT userid, ccnum FROM creditcards WHERE ccnum ='"+req.body['card-num'] +"' AND userid = "+req.params.id);
		
		query.on("row", function (row, result) {
    		result.addRow(row);
   		});
   		
		query.on("end", function (result) {
			if(result.rows.length != 0){
				client.end();
				res.json(400,'You have already registered this card.');
			}
			else{
				
				var today = new Date();
				
				if ((req.body['select-choice-year'] < today.getFullYear()) || ((req.body['select-choice-year'] == today.getFullYear()) && (req.body['select-choice-month'] < today.getMonth()))){
					client.end();
					res.json(400,"Oh no! The credit card you are trying to register has expired! :(");
				}
				else{
					var query2 = client.query("INSERT INTO creditcards (userid,ccholdername,ccnum,ccv,ccexpmonth,ccexpyear)" + 
												"VALUES("+req.params.id+", '"+req.body['card-holder-name']+"', '"+req.body['card-num']+"', "+req.body.ccv+", '"+req.body['select-choice-month']+"', '"+req.body['select-choice-month']+"');");
					
					query2.on("row", function (row, result){
							result.addRow(row);
					});
					
					query2.on("end", function (result) {
						var response = {"card":result.rows[0]};
						client.end();
						res.json(200,response);	
					});
					
				}
			}
		});
	}
});

//Get all cards associated with one user id, from creditCard-users relationship table, where id is primary key ----------------------------------------------------
app.get('/cards/:id', function(req, res){
	console.log("Get the credit cards for user " + req.params.id + " request received.");

	var client = new pg.Client(conString);
	client.connect();
		
	var query = client.query("SELECT userid, ccholdername, ccnum, ccexpmonth, ccexpyear FROM creditcards WHERE userid = "+req.params.id);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.json(404,'You have no credit cards.');
		}
		else{
			var response = {"cards" : result.rows};
			client.end();
			res.json(response);
		}
	});
});

//remove card by card num-------------------------------------------------------
//TODO [fix] SQL :S
app.del('/cards/:carnum', function(req, res) {
	var lastfour = ""+req.params.carnum[12]+req.params.carnum[13]+req.params.carnum[14]+req.params.carnum[15];
	console.log("Delete card ending in " + lastfour + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
		
	var query = client.query("DELETE * FROM creditcards WHERE userid = "+req.params.id+" AND ccnum = '"+req.params.carnum+"'");
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		var removed = result;
		client.end();
		res.statusCode = 200;
		res.send('Card ending in '+ lastfour +' was removed.');
		res.json({"card" : removed});
	});
});

/*
 * REST API for addresses*********************************************************************************************************************
 */

//Create new address
app.post("/newaddress/:id", function(req, res){
	console.log("Add new card request received from user with id " + req.params.id);

  	if(req.params.id == "" || req.body['address-line1'] == "" || req.body['address-line2'] == "" || req.body['address-city'] == "" || req.body['address-zip'] == ""){
		res.statusCode = 400;
		res.json('The form has missing fields.');
	}
		
	else{
		var client = new pg.Client(conString);
		client.connect();
		
		var query = client.query("INSERT INTO addresses (userid, aline1, aline2, acity, acountry, astate, azipcode) VALUES("+req.params.id +", '"+ req.body['address-line1'] + "', '"+
									req.body['address-line2'] + "', '"+ req.body['address-city'] + "','"+req.body['select-choice-country']+ "','"+req.body['select-choice-state'] + 
									"', '"+ req.body['address-zip'] +"');");
		
		query.on("row", function (row, result) {
    		result.addRow(row);
   		});
	
		query.on("end", function (result) {
			var response = {"address":result.rows[0]};
			client.end();
			res.json(200,response);
		});
	}
});

//Get all addresses associated with one user id, from creditCard-users relationship table, where id is primary key ----------------------------------------------------
app.get('/addresses/:id', function(req, res){
	console.log("Get the addresses for user " + req.params.id + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
		
	var query = client.query("SELECT * FROM addresses WHERE userid = "+req.params.id);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.json('You have not registered any addresses.');
		}
		else {
			var response = {"addresses" : result.rows};
			client.end();
			res.statusCode = 200;
  			res.json(response);		
		}
	});
});

//Remove address by addressid-------------------------------------------------------
//TODO SQL
app.del('/addresses/:index', function(req, res) {
	console.log("Delete address request received.");
	
	if(addresses.length == 0) {
		res.statusCode = 404;
		res.send('No such address found');
	}
	else{
		if (req.params.index >= addresses.length){
			res.statusCode = 404;
			res.send("No such address found.");			
		}	
		else {	
			var removed = addresses.splice(req.params.index, 1);
			res.statusCode = 200;
			res.json({"address" : removed});
		}
	}
});


//REST API for products**************************************************************************************************************************

//browse product by category------------------------------------------------------
app.get('/browse/:category', function(req, res){
	console.log("Get " + req.params.category + " products request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	if(req.params.category == 'all')
		var query = client.query("SELECT * FROM products");
	else
		var query = client.query("SELECT products.* FROM products,categories WHERE pcategoryid = catid AND catname = '" + req.params.category + "'");
	
	query.on("row", function (row, result) {
    	result.addRow(row);
    });
	query.on("end", function (result) {
		var response = {"products" : result.rows};
		client.end();
  		res.json(response);
 	});
});

//get product by id-----------------------------------------------------
app.get('/product/:id', function(req, res){
	console.log("Get product " + req.params.id + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT products.*, users.username FROM products,users WHERE products.pid = $1 AND products.pseller=users.uid ",[req.params.id]);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
    });
	query.on("end", function (result) {
		var response = {"product" : result.rows[0]};
		client.end();
		res.statusCode = 200;
  		res.json(response);
	});	
});

//new product-------------------------------------------------
//TODO authorize user
//TODO SQL
app.post('/newproduct', function(req, res) {
	console.log("Add new product request received.");
	
  	if(req.body.name=="" || req.body.category=="" || req.body.instantprice==""
  	|| req.body.description=="" || req.body.model == "" 
  	|| req.body.brand=="" || req.body.dimensions=="" || req.body.seller=="" || req.body.bid=="") {
		res.statusCode = 400;
		res.send('Product form is missing fields.');
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
//TODO authorize user
//TODO SQL
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
//TODO authorize user
//TODO SQL
app.del('/product/:id', function(req, res) {
	console.log("Delete product " + req.params.id + "request received.");
	if(productList.length <= req.params.id || req.params.id < 0) {
		res.statusCode = 404;
		res.send('No such product found');
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
			res.send("No such product found.");			
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
	if(req.body.username == "" || req.body.password == ""){
		res.json(400,'The form has missing fields.');
	}
	else{
		var client = new pg.Client(conString);
		client.connect();
		
		var query = client.query("SELECT * FROM users WHERE username = '" + req.body.username + "'");
		
		query.on("row", function (row, result) {
	    	result.addRow(row);
	    });
		query.on("end", function (result) {
			if(result.rows.length == 1 && result.rows[0].upassword == req.body.password){
				var response = {"user":result.rows[0]};
				client.end();
				res.json(200,response);
			}
			else{
				res.statusCode = 404;
				res.json(404,"Username/password entered not valid.");	
				}
		 	});			
		}
});

//user register-------------------------------------------------
app.post("/register", function(req, res){
	console.log("Registration request received for " + req.body.newusername);
  	if(req.body.newusername == "" || req.body.newpassword == "" || req.body.newemail == ""){
		res.json(400,'The form has missing fields.');
	}
	else {
				
		var client = new pg.Client(conString);
		client.connect();
		
		var query = client.query("SELECT username FROM users WHERE username = '" + req.body.newusername + "'");		
		query.on("row", function (row, result) {
	    	result.addRow(row);
	    });
		query.on("end", function (result) {
			if(result.rows.length != 0){
				client.end();
				res.json(400,"Username not available.");
			}
			else{
				query2 = client.query("SELECT uemail FROM users WHERE uemail = '" + req.body.newemail + "'");
				query2.on("row", function (row, result) {
		    		result.addRow(row);
			    });
				query2.on("end", function (result) {
					if(result.rows.length != 0){
						client.end();
						res.json(400,"Email already in use.");
					}
					else{
						query3 = client.query("INSERT INTO users (username,upassword,uemail,ufname,ulname,utype)"
											+ "VALUES ('"+req.body.newusername+"','"+req.body.newpassword+"','"+
											req.body.newemail+"','"+req.body.newfname+"','"+req.body.newlname+"','user') "+
											"RETURNING *");
						query3.on("row", function (row, result){
							result.addRow(row);
						});
						query3.on("end", function (result) {
							var response = {"user":result.rows[0]};
							client.end();
							res.json(200,response);	
						});
					}
				});
			}
		});			
	}
});

//password reset-------------------------------------------------
app.post("/reset", function(req, res){
	console.log("Reset request received for " + req.body.resetemail);
  	if(req.body.resetemail == "")
		res.json(400,"The form has missing fields.");
	
	else{
		var client = new pg.Client(conString);
		client.connect();
		
		var query = client.query("SELECT * FROM users WHERE uemail = '" + req.body.resetemail + "'");
		query.on("row", function(row,result){
			result.addRow(row);
		});
		query.on("end", function(result){
			if(result.rows.length == 0){
				client.end();
				res.json(400, "Invalid email.");
			}
			else{
				var response = {"user":result.rows[0]};
				client.end();				
				res.json(200,response);								
			}
		});		
	}
	
});

//update password--------------------------------------------------
app.post("/password", function(req,res){
	console.log("Change password request received from " + req.body.username);
	if(req.body.updpassword == ""){
		res.json(400,"Please enter a password.");
	}
	else {		
		var client = new pg.Client(conString);
		client.connect();
		
		var query = client.query("SELECT * FROM users WHERE username = '" + req.body.username + "'");
		query.on("row", function(row,result){
			result.addRow(row);
		});
		query.on("end", function(result){
			if(result.rows[0].upassword == req.body.password){
				var query2 = client.query("UPDATE users SET upassword = '" + req.body.updpassword + "'" +
					"WHERE username = '" + req.body.username + "'");
				query2.on("end", function(result){
					client.end();
					res.json(200,"Password updated.");
				});				
			}
			else{
				client.end();
				res.json(401,false);
			}
		});		
	}
});

//update avatar--------------------------------------------------
app.post("/avatar", function(req,res){
	console.log("Change avatar request received from " + req.body.username);
	if(req.body.updavatar == "")
		res.json(400,"Please enter an URL.");
	else {
		var client = new pg.Client(conString);
		client.connect();
		
		var query = client.query("SELECT * FROM users WHERE username = '" + req.body.username + "'");
		query.on("row", function(row,result){
			result.addRow(row);
		});
		query.on("end", function(result){
			if(result.rows[0].upassword == req.body.password){
				var query2 = client.query("UPDATE users SET uavatar = '" + req.body.updavatar + "'" +
					"WHERE username = '" + req.body.username + "'");
				query2.on("end", function(result){
					client.end();
					res.json(200,true);
				});				
			}
			else{
				client.end();
				res.json(401,false);
			}
		});		
	}
});


//user product methods****************************************************************************8
//bid on item-------------------------------------------------------------
//TODO authorize user
//TODO SQL
app.post("/bid/:id", function(req, res){
	console.log("Bid on item " + req.params.id + " of $" + req.body.bid);
		
	if(productList.length <= req.params.id || req.params.id < 0){
		res.statusCode = 404;
		res.send('No such product found.');
	}
	
	else if(req.body.bid == undefined || isNaN(req.body.bid))
		res.send(400,"Please enter a valid bid value.");
		
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
			res.send('No such product found.');
		}
		else if(productList[target].nextbidprice >= req.body.bid){
			res.statusCode = 400;
			res.send('Bid price must be higher than $' + productList[target].nextbidprice + '.');
		}
		else if(productList[target].instantprice <= req.body.bid)
			res.send(400, 'Bid price must be lower than the instant price $' + productList[target].instantprice);
			
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
				res.json(true);
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
				res.json(true);
			}
		}
	}
	
});



//add item to cart
//TODO SQL
app.post("/addtocart", function(req,res){
	
	if(req.body.qty == 0 || req.body.qty == ""){
		res.statusCode = 400;
		res.json("Please specify a quantity");
	}
	
	console.log("Add item " + req.body.id + "(" + req.body.qty + ") to " + req.body.username + "'s cart request received.");
	
	var target=-1;
	//search for user
	for (var i=0; i < userList.length; ++i){
		if (userList[i].username == req.body.username){
			if(userList[i].password == req.body.password){
				target = i;
			}
		}	
	}
	if(target==-1){
			//TODO send to login page
			res.statusCode = 404;
			res.json("Invalid username/password.");
	}	
	else{
		
		//item already in cart
		var done = false;
		for(var i=0;i < userList[target].cart.length;i++){
			if(userList[target].cart[i].id == req.body.id){
				userList[target].cart[i].qty += req.body.qty;
				done = true;
				res.statusCode = 200;
				res.json(true);
			}
		}		
		
		//new item
		if(!done){
			//search for product
			for (var i=0; i < productList.length; ++i){
				if (productList[i].id == req.body.id){
					userList[target].cart.push({"id":productList[i].id,"qty":req.body.qty});
					res.statusCode = 200;
					res.json(true);
				}
			}
			res.statusCode = 404;
			res.json("Item not found.");
		}
	}
});

//places order
//TODO remove item from cart if not found
//TODO SQL
app.post("/placeorder", function(req,res){
	console.log("Place " + req.body.username + "'s order request received.");
	
	var target=-1;
	//search for user
	for (var i=0; i < userList.length; ++i){
		if (userList[i].username == req.body.username){
			if(userList[i].password == req.body.password){
				target = i;
			}
		}	
	}
	if(target==-1){
			//TODO send to login page
			res.statusCode = 404;
			res.json("Invalid username/password.");
	}	
	else{	
		var cart = userList[target].cart;
		console.log("Items in cart: " + JSON.stringify(cart));
		var solditem, sale;
		//for each item in the cart
		var cartlength = cart.length;
		for(var j=0; j < cartlength; j++){	
			solditem = cart.pop();	
			//search for item in product list
			for (var i=0; i < productList.length; ++i){
				if (productList[i].id == solditem.id){
					sale = new Sale(productList[i].name, productList[i].category, solditem.qty*productList[i].instantprice, 
							productList[i].seller, req.body.username, new Date(), productList[i].photo, solditem.qty);
					sale.id = saleNextId++;
					salesList.push(sale);
					userList[target].sales.push(saleNextId - 1);
				}				
			}
			console.log("Sold: " + JSON.stringify(solditem));
		}
		res.statusCode = 200;
		res.json(true);
	}	
});

//returns items in user cart
//TODO remove item from cart if not found
//TODO SQL
app.post("/loadcart", function(req,res){
	console.log("Get " + req.body.username + "'s cart request received.");
	
	var target=-1;
	//search for user
	for (var i=0; i < userList.length; ++i){
		if (userList[i].username == req.body.username){
			if(userList[i].password == req.body.password){
				target = i;
			}
		}	
	}
	if(target==-1){
			//TODO send to login page
			res.statusCode = 404;
			res.json("Invalid username/password.");
	}	
	
	else{
		var tempList = userList[target].cart;
		var cartList = new Array();
		var total = 0;
		//search for items
		for(var j=0; j < tempList.length; j++){			
			for (var i=0; i < productList.length; ++i){
				if (productList[i].id == tempList[j].id){
					cartList.push({"name":productList[i].name,"id":productList[i].id,"instantprice":productList[i].instantprice, "qty":tempList[j].qty});
					total += productList[i].instantprice * tempList[j].qty;
				}
			}	
		}	
		res.statusCode = 200;
		res.json({"cart":cartList,"total":total});
	}
});

//return sales report based on date and category
app.post("/sales", function(req,res){
	var fromDate = new Date(req.body.fromDate);
	var toDate = new Date(req.body.toDate);
	
	fromDate = fromDate.getFullYear() + "-" + (fromDate.getMonth()+1) + "-" + fromDate.getDate(); 
	toDate = toDate.getFullYear() + "-" + (toDate.getMonth()+1) + "-" + toDate.getDate();
	
	console.log("Sales report. Category: " + req.body.category + ". From: " + fromDate
				+ ". To: " + toDate);
	
	var client = new pg.Client(conString);
	client.connect();
	
	if(req.body['category']==null || req.body['category']=='all'){
		var temp = "SELECT idate, buyer.username as buyer, seller.username as seller, sname, squantity, sprice FROM invoices,invoicecontent,sales,users as seller,users as buyer" +
					" WHERE idate >= DATE '" + fromDate + "' AND idate <= DATE '" + toDate + "'" +
					" AND seller.uid=isellerid AND buyer.uid=ibuyerid AND invoiceid=iid AND saleid=sid";
		var query = client.query(temp);
	}
	
	else{
		var temp = "SELECT idate, buyer.username as buyer, seller.username as seller, sname, squantity, sprice FROM invoices,invoicecontent,sales,categories,users as seller,users as buyer" +
					" WHERE idate >= DATE '" + fromDate + "' AND idate <= DATE '" + toDate + "'" +
					" AND seller.uid=isellerid AND buyer.uid=ibuyerid AND invoiceid=iid AND saleid=sid AND scategoryid=catid AND catname='" + req.body.category + "'";
		var query = client.query(temp);
	}
	query.on("row", function (row, result) {
    	result.addRow(row);
    });
	query.on("end", function (result) {
		var totalrevenue = 0;
		for(var i=0;i<result.rows.length;i++)
			totalrevenue += parseFloat(result.rows[i].sprice.slice(1))*result.rows[i].squantity;
		client.end();
		res.statusCode = 200;
  		res.json({"sales":result.rows,"totalRevenue":totalrevenue,"totalSales":result.rows.length});
	});	
});


//bidding list
//TODO SQL
app.post("/loadbids", function(req,res){
	console.log("Get " + req.body.username + "'s bids request received.");
	
	var target=-1;
	//search for user
	for (var i=0; i < userList.length; ++i){
		if (userList[i].username == req.body.username){
			if(userList[i].password == req.body.password){
				target = i;
			}
		}	
	}
	if(target==-1){
			//TODO send to login page
			res.statusCode = 404;
			res.json("Invalid username/password.");
	}	
	
	else{
		
		var tempList = new Array();
		for(var i=0; i< userList[target].bidding.length; i++){
			for(var j=0; j< productList.length; j++){
				if(productList[j].id==userList[target].bidding[i].id){
					tempList.push(productList[j]);
				}
			}
		}
				
		res.statusCode=200;
		res.json({"bid":tempList});
	
	
	}
});

//Seller Catalog
//TODO SQL
app.post("/catalog", function(req,res){
	console.log("Get " + req.body.username + "'s catalog request received.");
	
	var target=-1;
	//search for user
	for (var i=0; i < userList.length; ++i){
		if (userList[i].username == req.body.username){
			if(userList[i].password == req.body.password){
				target = i;
			}
		}	
	}
	if(target==-1){
			//TODO send to login page
			res.statusCode = 404;
			res.json("Invalid username/password.");
	}	
	else{
		var tempList = new Array();
		
			for(var j=0; j< productList.length; j++){
				if(productList[j].seller==userList[target].username){
					tempList.push(productList[j]);
				}
			
		}
		res.statusCode=200;
		res.json({"cat":tempList});
	}
});


console.log("Server started. Listening on port 8888.");
app.listen(8888);