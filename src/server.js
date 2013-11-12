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
app.post("/newcard/", function(req, res){
	console.log("Add new card request received from user "+req.body.username);

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
		
		var query = client.query("SELECT * FROM creditcards WHERE ccnum ='"+req.body['card-num'] +"' AND userid = "+req.body.id);
		
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
				
				if ((req.body['select-choice-year'] < today.getFullYear()) || ((req.body['select-choice-year'] == today.getFullYear()) && (req.body['select-choice-month'] <= today.getMonth()))){ 
					client.end();
					res.json(400,"Oh no! The credit card you are trying to register has expired! :(");
				}
				
				else{
					var query2 = client.query("INSERT INTO creditcards (userid,ccholdername,ccnum,ccv,ccexpmonth,ccexpyear)" + 
												"VALUES("+req.body.id+", '"+req.body['card-holder-name']+"', '"+req.body['card-num']+"', "+req.body.ccv+", '"+req.body['select-choice-month']+"', '"+req.body['select-choice-month']+"');");
					
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
app.get('/cards/', function(req, res){
	console.log("Get the credit cards for user " + req.body.id + " request received.");

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
//TODO [fix] SQL
//BTW the attribute ccnum in creditcards should be a char(16) instead of an int, since it's a 16-digit number
app.del('/cards/:ccid', function(req, res) {
	//var lastfour = ""+req.params.carnum[12]+req.params.carnum[13]+req.params.carnum[14]+req.params.carnum[15];
	//console.log("Delete card ending in " + lastfour + " request received.");
	console.log("Delete card " + req.params.ccid + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
		
	//check that the user has a credit card with the specified cardnum
	var query = client.query("SELECT * FROM creditcards WHERE userid = "+req.params.id+" AND ccnum = '"+req.params.carnum+"'");
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.send('Unable to proceed, you have no credit cards with that number.'); 
		}
		else{
			var query2 = client.query("DELETE FROM creditcards WHERE userid = "+req.params.id +" AND ccnum ='"+req.params.carnum+"'");
	
			query2.on("row", function (row, result) {
		    	result.deleteRow(row); //?
		   	});
		   	
		   	query2.on("end", function (result) {
				var removed = result.rows[0];
				client.end();
				res.statusCode = 200;
				res.send('Card ending in '+ lastfour +' was successfully removed.');
				res.json({"card" : removed});
			});
		}
	});
});

//Update credit card by ccid
app.post("/cards/:id", function(req,res){

	console.log("Update card request received."); //need req.body.ccid
	
	var client = new pg.Client(conString);
	client.connect();
		
	//check that the card is already associated with the user
	var query = client.query("SELECT * FROM creditcards WHERE userid = "+req.params.id+" AND ccid = '"+req.body.ccid+"'");
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		//either card does not exist [404] or unauthorized user [401]
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.send('Unable to proceed; card not found.'); 
		}
		else{
			var query2 = client.query("UPDATE creditcards SET ccholdername ='"+req.body['card-holder-name']+"', ccnum ='"+req.body['card-num']+"', ccv ="+req.body.ccv+
										", ccexpmonth ='"+req.body['select-choice-month']+"', ccexpyear ='"+req.body['select-choice-month']+"' WHERE userid = "+req.params.id +
										" AND ccid ='"+req.body.ccid+"'");
		   	
		   	query2.on("end", function (result) {
				client.end();
				res.json(200,true);
			});
		}
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
//TODO [fix] SQL [delete]
app.del('/addresses/:index', function(req, res) {
	console.log("Delete address request received.");

	var client = new pg.Client(conString);
	client.connect();
	
	//check if the user has addresses
	var query = client.query("SELECT * FROM addresses WHERE userid = "+req.params.id);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0) {
			client.end();
			res.statusCode = 404;
			res.send('Cannot delete a non-existing address!'); //this might never happen, but just in case xD
		}
		else{
			var query2 = client.query("DELETE FROM addresses WHERE userid = "+req.params.id+" AND aid = "+req.params.index);
			
			query2.on("row", function (row, result) {
		    	result.deleteRow(row); //? not sure if it's done like this... :/
		   	});
		   	
		   	query2.on("end", function (result) {
				var removed = result.rows[0];
				client.end();
				res.statusCode = 200;
				res.send('Address was removed.');
				res.json({"address" : removed});
			});
		}
	});
});

//Update address by aid
app.post("/addresses/:id", function(req,res){

	console.log("Update address request received."); //need req.body.aid
	
	var client = new pg.Client(conString);
	client.connect();
		
	//check that the card is already associated with the user
	var query = client.query("SELECT * FROM addresses WHERE userid = "+req.params.id+" AND aid = '"+req.body.aid+"'");
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.send('Unable to proceed; address not found.'); 
		}
		else{
			var query2 = client.query("UPDATE addresses SET aline1 ='"+req.body['address-line1']+"', aline2 ='"+req.body['address-line2']+"', acity ='"+req.body['address-city']+"', acountry ="+req.body['select-choice-country']+
										", astate ='"+req.body['select-choice-state']+"', azipcode ='"+req.body['address-zip']+"' WHERE userid = "+req.params.id +
										" AND aid ='"+req.body.aid+"'");
		   	
		   	query2.on("end", function (result) {
				client.end();
				res.json(200,true);
			});
		}
	});
});

//REST API for products**************************************************************************************************************************

//browse product by category------------------------------------------------------
//TODO add auction information
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
  		res.json(200,response);
 	});
});

//get product by id-----------------------------------------------------
//TODO add auction information
app.get('/product/:id', function(req, res){
	console.log("Get product " + req.params.id + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT products.*, users.username FROM products,users WHERE products.pid = $1 AND products.psellerid=users.uid ",[req.params.id]);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
    });
	query.on("end", function (result) {
		var response = {"product" : result.rows[0]};
		client.end();
  		res.json(200,response);
	});	
});

//new product-------------------------------------------------
app.post('/newproduct', function(req, res) {
	console.log("Add new product request received.");
	
  	if(req.body.newproductname=="" || req.body.newproductcategory=="" || req.body.newproductprice==""
  	|| req.body.newproductdescription=="" || req.body.newproductmodel == "" 
  	|| req.body.newproductbrand=="" || req.body.newproductdimensions=="" || req.body.newproductquantity=="") {
		res.json(400,"Product form is missing fields.");
	}
	else{
		if(req.body.forbid != undefined && (parseFloat(req.body.newproductprice,10) < parseFloat(req.body.newproductbidprice,10)))
			res.json(400,"Product price must be greater than bid price.");
		else{
			var client = new pg.Client(conString);
			client.connect();
			
			var query = client.query("SELECT * FROM users WHERE username = '" + req.body.username + "'");
			query.on("row", function(row,result){
				result.addRow(row);
			});
			query.on("end", function(result){
				if(result.rows[0].upassword == req.body.password){
					var sellerid = result.rows[0].uid;
					var query2 = client.query("SELECT catid FROM categories WHERE catname = '" + req.body.newproductcategory + "'");
					query2.on("row", function(row,result){
						result.addRow(row);
					});
					query2.on("end", function(result){	
						var categoryid = result.rows[0].catid;			
						var query3 = client.query("INSERT INTO products (pname,pdescription,pmodel,pphoto,pbrand,pdimensions,psellerid,pcategoryid,pprice,pquantity)" +
										"VALUES ('"+req.body.newproductname+"','"+req.body.newproductdescription+"','"+req.body.newproductmodel+"','"+req.body.newproductphoto +
										"','"+req.body.newproductbrand+"','"+req.body.newproductdimensions+"','"+sellerid+"','"+categoryid+"','"+req.body.newproductprice +
										"','"+req.body.newproductquantity+"') RETURNING pid");
						query3.on("row", function(row,result){
							result.addRow(row);
						});
						query3.on("end", function(result){	
							if(req.body.forbid != undefined){
								var startDate = new Date(req.body.newauctstart);
								var endDate = new Date(req.body.newauctend);									
								startDate = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate(); 
								endDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();
								
								var itemid = result.rows[0].pid;
								var query4= client.query("INSERT INTO auction (aucstart,aucend,aucstartbid,aucitemid)" +
									" VALUES ('"+startDate+"','"+endDate+"','" +
									req.body.newproductbidprice+"','"+itemid+"')");
								query4.on("end", function(row,result){
									client.end();
									res.json(200,true);
								});									
							}
							else{
								client.end();
								res.json(200,true);
							}
						});
					});			
				}
				else{
					client.end();
					res.json(401,false);
				}
			});						
		}	
	}	
});

//update product-------------------------------------------------
app.post('/product/:pid', function(req, res) {
	
	if(req.body.name=="" || req.body.category=="" || req.body.instantprice==""
  	|| req.body.description=="" || req.body.model == "" || req.body.photo==""
	|| req.body.brand=="" || req.body.dimensions=="" || req.body.seller==""
	|| req.body.quantity=="") {
		res.json(400, "Product form is missing fields.");
	}
	
	console.log("Update product " + req.body.pid + "request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	//check that product exists
	var query = client.query("SELECT * FROM products WHERE pid="+req.body.pid);
	
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	query.on("end", function (result) {
		if(result.rows.length > 0){
			client.end();
			res.json(404,"No such product found.");
		}
		else{
			//check that user is seller of the product
			var query2 = client.query("SELECT * FROM products WHERE pseller ="+req.params.id+" AND pid="+req.body.pid);
			
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {
				//user is not seller of the product
				if(result.rows.length == 0){
					client.end();
					res.json(401,"You are not authorized to update this product.");
				}
				else{
					//(pname, pdescription, pmodel, pphoto, pbrand, pdimensions, pcategoryid, pprice, pquantity)
					var query3 = client.query("UPDATE products SET pname = '"+req.body.name+"', pdescription = '"+req.body.description+"', pmodel = '"+req.body.model+
												"', pphoto = '"+req.body.photo+"', pbrand = '"+req.body.brand+"', pdimensions = '"+req.body.dimension+"', pcategoryid = "+req.body.category+", pprice = '"+
												req.body.instantprice+"', pquantity = "+req.body.quantity+" WHERE pseller ="+req.params.id+" AND pid="+req.body.pid);
			
					query3.on("row", function (row, result) {
						result.addRow(row);
					});
					
					query3.on("end", function (result) {
						client.end();
						res.json(200,"Product was updated.");
					});
				}
			});	
		}
	});
});

//delete product by id-------------------------------------------------------
//TODO add functionality for admins
//TODO verify delete
app.del('/products/:pid', function(req, res) {
	console.log("Delete product " + req.body.pid + "request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT * FROM products WHERE pid ="+req.body.pid);
	
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	query.on("end", function (result) {
		//product not found
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.send('No such product found.');
		}
		else{
			//if found, check that user is authorized (either seller or admin)

			var query2 = client.query("SELECT * FROM products WHERE pid ="+req.body.pid+" AND pseller = "+req.params.id);
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {
				if(result.rows.length == 0){
					//user is a normal user but not the seller
					client.end();
					res.send(401,"Unable to delete product, user is not authorized");
				}
				else{
					//if user is authorized, proceed to delete product
					var query3 = client.query("DELETE FROM products WHERE pid ="+req.body.pid);

					query3.on("row", function (row, result) {
						result.deleteRow(row); //productList.deleteRow(row) ?
					});
					
					query3.on("end", function (result) {
						client.end();
						res.send(200,'Product was removed.');
					});
				}
			});	
		}
	});
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
	
	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT * FROM products");
	
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	query.on("end", function (result) {
		if(result.rows.length <= req.params.id || req.params.id < 0){
			client.end();
			res.statusCode = 404;
			res.send('No such product found.');
		}
		
		else if(req.body.bid == undefined || isNaN(req.body.bid)){
			client.end();
			res.send(400, "Please enter a valid bid value.");
		}
	
		else{
			var query = client.query("SELECT * FROM products, bid WHERE products.pid = bids.pid");
			
			query.on("row", function (row, result) {
				result.addRow(row);
			});
			
			if(result.rows.length==0){
				res.statusCode = 404;
				res.send('No such product found.');
			}
			else if(result.rows[0].nextbidprice >= req.body.bid){
				res.statusCode = 400;
				res.send('Bid price must be higher than $' + result.rows[0].nextbidprice + '.');
			}
			else if(result.rows[0].instantprice <= req.body.bid){
				res.send(400, 'Bid price must be lower than the instant price $' + result.rows[0].instantprice);
			}
		
			else{
				var item = result;
				item.rows[0].nextbidprice = req.body.bid;
				
				//is it a bid from a new user?
				var query2 = client.query("SELECT * FROM bidders");
				query.on("row", function (row, result) {
					result.addRow(row);
				});
				
				var bidders = result;
				
				var query3 = client.query("SELECT * FROM bidders WHERE bidders.username=" + req.body.username);
				query.on("row", function (row, result) {
					result.addRow(row);
				});
				
				var bidder = result;
				
				//new bidder, add him to bidder list and add item to user bids
				if(bidder.rows.length == 0){
					//add new user and item to the bids list
					var query3 = client.query("INSERT INTO bids(bidderid, pid, bvalue) VALUES("+req.params.id +", " + req.body.pid +", " + req.body.bvalue + ")");		
							
					res.statusCode = 200;
					res.json(true);
				}
				//previous bidder, update bid
				else{
					//update item bid price to bid price of user
					item.bid = req.body.bid;
					
					//update bid price in the bidding list of the user
					var query4 = client.query("SELECT * FROM bids,users WHERE bidderid = " + req.params.id);
					query.on("row", function (row, result) {
						result.addRow(row);
					});
					
					var userbids = result;
					
					var query5 = client.query("UPDATE bids SET bvalue = " + req.body.bvalue + "WHERE bids.bidderid = " + req.params.id);
					
					res.statusCode = 200;
					res.json(true);
				}
			}	
		}
	});
});

		
	// if(productList.length <= req.params.id || req.params.id < 0){
		// res.statusCode = 404;
		// res.send('No such product found.');
	// }
// 	
	// else if(req.body.bid == undefined || isNaN(req.body.bid))
		// res.send(400,"Please enter a valid bid value.");
// 		
	// else{
		// //find item being bidded on
// 		
// 		
		// var id = req.params.id;
		// var target = -1;
		// for (var i=0; i < productList.length; ++i){
			// if (productList[i].id == id){
				// target = i;
				// break;	
			// }
		// }
// 		
		// if(target == -1){
			// res.statusCode = 404;
			// res.send('No such product found.');
		// }
		// else if(productList[target].nextbidprice >= req.body.bid){
			// res.statusCode = 400;
			// res.send('Bid price must be higher than $' + productList[target].nextbidprice + '.');
		// }
		// else if(productList[target].instantprice <= req.body.bid)
			// res.send(400, 'Bid price must be lower than the instant price $' + productList[target].instantprice);
// 			
		// else{
			// var item = productList[target];
// 			
			// //update nextbid price
			// item.nextbidprice = req.body.bid;
// 			
			// //is it a bid from a new user?
			// target = -1;
			// for(var i=0; i < item.bidders.length; i++){
				// if(item.bidders[i].username == req.body.username){
					// target = i;
					// break;
				// }
			// }
			// //new bidder, add him to bidder list and add item to user bids
			// if(target == -1){
				// //add new user to the bidder list of the item				
				// item.bidders.push({"username" : req.body.username, "bid" : req.body.bid});
// 				
				// //add item to the bidding list of the user
				// for(var i=0; i < userList.length; i++){
					// if(userList[i].username == req.body.username){
						// userList[i].bidding.push({"id" : id, "bid" : req.body.bid});
						// break;
					// }
				// }
				// res.statusCode = 200;
				// res.json(true);
			// }
			// //previous bidder, update bid
			// else{
				// //update bid price of user
				// item.bidders[target].bid = req.body.bid;
// 				
				// //update bid price in the bidding list of the user
				// for(var i=0; i < userList.length; i++){
					// if(userList[i].username == req.body.username)
						// for(var j=0; j < userList[i].bidding.length; j++)
							// if(userList[i].bidding[j].id == id){
								// userList[i].bidding[j].bid = req.body.bid;
								// break;
							// }				
				// }
				// res.statusCode = 200;
				// res.json(true);
			// }
		// }
	// }
// 	
// });


//add item to cart
app.post("/addtocart", function(req,res){
	if(req.body.qty == 0 || req.body.qty == ""){
		res.statusCode = 400;
		res.json("Please specify a quantity");
	}
	
	console.log("Add item " + req.body.id + "(" + req.body.qty + ") to " + req.body.username + "'s cart request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	//check user
	var query = client.query("SELECT * FROM users WHERE username ='"+req.body.username +"' AND upassword = '"+req.body.password+"'");
	
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.json(404,'Please log in or register.');
		}
		
		else{
			//search for product
			var query2 = client.query("SELECT * FROM products WHERE pid ="+req.body.id);
					
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {
				//product was found
				if(result.rows.length > 0){
					var query3 = client.query("SELECT * FROM carts WHERE pid = "+req.body.id+" AND userid ="+req.params.id);
			
					query3.on("row", function (row, result) {
						result.addRow(row);
					});
			
					query3.on("end", function (result) {
						//item already in cart
						if(result.rows.length > 0){
							var query4 = client.query("UPDATE carts SET cquantity = cquantity + "+req.body.qty+" WHERE pid = "+req.body.id+" AND userid ="+req.params.id);
							
							query4.on("row", function (row, result) {
								result.addRow(row);
							});
							
							query4.on("end", function (result) {
								client.end();
								res.json(200,'Cart was updated.');
							});	
						}
						//new item
						else{
							var query4 = client.query("INSERT INTO carts VALUES("+req.params.id+","+req.body.id+","+req.body.qty+");");
							
							query4.on("row", function (row, result) {
								result.addRow(row);
							});
							
							query4.on("end", function (result) {
								client.end();
								res.json(200,'Cart was updated.');
							});	
						}
					});
				}			
				//product not found
				else{
					client.end();
					res.json(404,'Product was not found.');
				}	
			});
		}
	});
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
app.post("/loadcart", function(req,res){
	console.log("Get " + req.body.username + "'s cart request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT * FROM users WHERE username ='"+req.body.username +"' AND upassword = '"+req.body.password+"'");
	
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.json(404,'Please log in or register.');
		}
		
		else{
			var query2 = client.query("SELECT * FROM users, carts, products WHERE carts.pid = products.pid AND users.uid = carts.userid AND users.username ='"+req.body.username+"'");
			
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {
				if(result.rows.length > 0){
					var productList = result.rows;
					var query3 = client.query("SELECT SUM(pprice) FROM users, carts, products WHERE carts.pid = products.pid AND users.uid = carts.userid AND users.username ='"+req.body.username+"'");
					
					query3.on("row", function (row, result) {
						result.addRow(row);
					});
					
					query3.on("end", function (result) {
						var totalPrice = result.rows[0];
						client.end();
						res.statusCode = 200;
						res.json({"cart":productList,"total":totalPrice});
					});
				}
				
				else{
					client.end();
					res.json(200,"You have no items on your cart.");
				}
			});
		}
	});
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


//user bidding list
//TODO some things are shady in here... Is this function supposed to get the products bidded on by the current user? If so, search should be by uid (req.params.id)
app.post("/loadbids", function(req,res){
	console.log("Get " + req.body.username + "'s bids request received.");

	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT * FROM users WHERE username = '"+req.body.username+"' AND upassword ='"+req.body.password+"'");
	
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.json("Invalid username/password.");
		}
		else{
			//select columns
			var query2 = client.query("SELECT * FROM users, bids, products WHERE (users.uid = bids.bidderid) AND (bids.pid = products.pid) AND username = '"+req.body.username+
										"' AND upassword ='"+req.body.password+"'");
			
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query.on("end", function (result) {
				client.end();
				res.statusCode=200;
				res.json({"bids" : result.rows});
			});
		}
	});
	
});

//product bids list
app.post("/loadproductbids", function(req,res){
	console.log("Get bids for product "+ req.params.id +"request received.");

	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT * FROM users WHERE username = '"+req.body.username+"' AND upassword ='"+req.body.password+"'");
	
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.json("Invalid username/password.");
		}
		else{
			//select columns
			var query = client.query("SELECT * FROM product, bids WHERE (bids.pid = products.pid) AND (product.pid = " + req.body.pid + ")");
			
			query.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query.on("end", function (result) {
				client.end();
				res.statusCode=200;
				res.json({"bids" : result.rows});
			});
		}
	});
	
});


//Seller Catalog
app.post("/catalog", function(req,res){
	console.log("Get " + req.body.sellername + "'s catalog request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT * FROM users WHERE username = '" + req.body.username + "'");
	query.on("row", function(row,result){
		result.addRow(row);
	});
	query.on("end", function(result){
		if(result.rows[0].upassword == req.body.password){
			var query2 = client.query("SELECT products.* FROM products,users WHERE username = '" + req.body.sellername + "' AND psellerid = uid");
			query2.on("row", function(row,result){
				result.addRow(row);
				console.log(JSON.stringify(row));
			});
			query2.on("end", function(result){
				client.end();
				res.json(200,{"products":result.rows});
			});
		}
		else{
			client.end();
			res.json(401,false);
		}
	});
	
});


console.log("Server started. Listening on port 8888.");
app.listen(8888);