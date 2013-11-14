//******************************************************************************************************//
//											SERVER.JS													//
//******************************************************************************************************//

var express = require('express');
var app = express();
var pg = require('pg');

// Database connection string: pg://<username>:<password>@host:port/dbname 
var conString = "pg://postgres:123@localhost:5432/icom5016";

//server configuration----------------------------------------------------------------------------------

app.use(express.bodyParser());

app.use(function(req, res, next){
 	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	next();
});

//REST API for credit cards*********************************************************************************************************************

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
												"VALUES("+req.body.id+", '"+req.body['card-holder-name']+"', '"+req.body['card-num']+"', "+req.body.ccv+", '"+req.body['select-choice-month']+"', '"+req.body['select-choice-year']+"');");
					
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
app.post('/cards/', function(req, res){
	
	console.log("Get " + req.body.username + "'s credit cards request received.");
	
	var client = new pg.Client(conString);
	client.connect();
		
	var query = client.query("SELECT userid, ccid, ccholdername, ccnum, ccexpmonth, ccexpyear FROM creditcards WHERE userid = "+req.body.id);
	
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

//remove card by ccid-------------------------------------------------------
app.del('/cards/:ccid', function(req, res) {
	console.log("Delete card " + req.params.ccid + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
		
	//check that the user has a credit card with the specified cardnum
	var query = client.query("SELECT * FROM creditcards WHERE userid = "+req.body.id+" AND ccid = "+req.params.ccid);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.send('Unable to proceed, credit card not found.'); 
		}
		else{
			var query2 = client.query("DELETE FROM creditcards WHERE ccid ="+req.params.ccid);

		   	query2.on("end", function (result) {
				client.end();
				console.log("Card removed.");
				res.send(200, true);
			});
		}
	});
});

//Update credit card by ccid
app.post("/cards/:ccid", function(req,res){

	console.log("Update card request received for card "+req.params.ccid);
	
	var client = new pg.Client(conString);
	client.connect();
		
	//check that the card is associated with the userid
	var query = client.query("SELECT * FROM creditcards WHERE userid = "+req.body.id+" AND ccid = "+req.params.ccid);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
   	});
	
	query.on("end", function (result) {
		//either card does not exist [404] or wrong userid [401]
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.send('Unable to proceed; card not found.'); 
		}
		else{
			var query2 = client.query("UPDATE creditcards SET ccholdername ='"+req.body['card-holder-name']+"', ccnum ='"+req.body['card-num']+"', ccv ="+req.body.ccv+
										", ccexpmonth ='"+req.body['select-choice-month']+"', ccexpyear ='"+req.body['select-choice-month']+"' WHERE ccid ="+req.params.ccid);
		   	
		   	query2.on("end", function (result) {
				client.end();
				res.json(200,true);
			});
		}
	});
});

//REST API for addresses*********************************************************************************************************************

//Create new address
app.post("/newaddress/", function(req, res){
	console.log("Add new address request received from user " + req.body.username);

  	if(req.body.id == "" || req.body['address-line1'] == "" || req.body['address-line2'] == "" || req.body['address-city'] == "" || req.body['address-zip'] == ""){
		res.statusCode = 400;
		res.json('The form has missing fields.');
	}
		
	else{
		var client = new pg.Client(conString);
		client.connect();
		
		var query = client.query("INSERT INTO addresses (userid, aline1, aline2, acity, acountry, astate, azipcode) VALUES("+req.body.id +", '"+ req.body['address-line1'] + "', '"+
									req.body['address-line2'] + "', '"+ req.body['address-city'] + "','"+req.body['select-choice-country']+ "','"+req.body['select-choice-state'] + 
									"', '"+ req.body['address-zip'] +"');");
		
		query.on("row", function (row, result) {
    		result.addRow(row);
   		});
	
		query.on("end", function (result) {
			var response = {"newaddress":result.rows[0]};
			client.end();
			res.json(200,response);
		});
	}
});

//Get all addresses associated with one user id, from creditCard-users relationship table, where id is primary key ----------------------------------------------------
app.post('/addresses/', function(req, res){
	console.log("Get the addresses for user " + req.body.username + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
		
	var query = client.query("SELECT * FROM addresses WHERE userid = "+req.body.id);
	
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
app.del('/addresses/:aid', function(req, res) {
	console.log("Delete address request received from user "+req.body.username);

	var client = new pg.Client(conString);
	client.connect();
	
	//check if userid is associated with aid
	var query = client.query("SELECT * FROM addresses WHERE userid = "+req.body.id+" AND aid ="+req.params.aid);
	
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
			var query2 = client.query("DELETE FROM addresses WHERE aid = "+req.params.aid);
		   	
		   	query2.on("end", function (result) {
				client.end();
				console.log("Address removed.");
				res.json(200,true);
			});
		}
	});
});

//Update address by aid
app.post("/address/:aid", function(req,res){

	console.log("Update address request received from user "+req.body.username);
	
	var client = new pg.Client(conString);
	client.connect();
		
	//check that the address is associated with the userid
	var query = client.query("SELECT * FROM addresses WHERE userid = "+req.body.id+" AND aid = "+req.params.aid);
	
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
app.get('/product/:id', function(req, res){
	console.log("Get product " + req.params.id + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	//check if product is in auction
	var query = client.query("SELECT * FROM auction WHERE auction.aucitemid ="+req.params.id);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
    });
	
	query.on("end", function (result) {
		//product is in auction
		if(result.rows.length > 0){
			var query2 = client.query("SELECT products.*, users.username, auction.aucstartbid FROM products,users,auction WHERE "+
										"products.pid = $1 AND products.psellerid=users.uid AND auction.aucitemid = products.pid",[req.params.id]);
		
			query2.on("row", function (row, result) {
			    	result.addRow(row);
			    });
				query2.on("end", function (result) {
					result.rows[0].forbid = true;
					var response = {"product" : result.rows[0]};
					client.end();
			  		res.json(200,response);
				});								
			}
		
		//product is not an auction item
		else{
			var query2 = client.query("SELECT products.*, users.username FROM products,users WHERE products.pid = $1 AND products.psellerid=users.uid ",[req.params.id]);
	
			query2.on("row", function (row, result) {
		    	result.addRow(row);
		    });
			query2.on("end", function (result) {
				result.rows[0].forbid = false;
				var response = {"product" : result.rows[0]};
				client.end();
		  		res.json(200,response);
			});
		}
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
	
	console.log("Update product " + req.params.pid + " request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	//check that product exists
	var query = client.query("SELECT * FROM products WHERE pid ="+req.params.pid);
	
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
			var query2 = client.query("SELECT * FROM products WHERE psellerid = "+req.body.id+" AND pid ="+req.params.pid);
			
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
												req.body.instantprice+"', pquantity = "+req.body.quantity+" WHERE psellerid ="+req.body.id+" AND pid="+req.body.params);
					
					query3.on("end", function (result) {
						client.end();
						res.json(200,true);
					});
				}
			});	
		}
	});
});

//delete product by id-------------------------------------------------------
//TODO authorize admins to delete products (if utype == admin)
app.del('/products/:pid', function(req, res) {
	console.log("Delete product " + req.params.pid + "request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	//check that product exists
	var query = client.query("SELECT * FROM products WHERE pid ="+req.params.pid);
	
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
			var query2 = client.query("SELECT * FROM products WHERE pid ="+req.params.pid+" AND psellerid = "+req.body.id);
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
					//if user is seller, proceed to delete product
					var query3 = client.query("DELETE FROM products WHERE pid ="+req.params.pid);
					
					query3.on("end", function (result) {
						client.end();
						console.log("Product deleted.");
						res.send(200,true);
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

//user product methods****************************************************************************

//bid on item-------------------------------------------------------------
app.post("/bid/:pid", function(req, res){	
	console.log("Bid on item " + req.params.pid + " of $" + req.body.bid);
	
	if(req.body.bid == undefined || isNaN(req.body.bid)){
		res.send(400, "Please enter a valid bid value.");
	}
	
	var client = new pg.Client(conString);
	client.connect();
	
	//check if bidding on item is possible
	var date = new Date();
	var datejson = date.toJSON();
	var today = datejson.substring(0,10);
	
	var query = client.query("SELECT products.pid, products.pprice, auction.* FROM products, auction WHERE pid = aucitemid AND aucitemid ="+req.params.pid+" AND aucstart <= '"+today+"' AND aucend > '"+today+"'");
	
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	query.on("end", function (result) {
		//product is not currently in auction
		if(result.rows.length == 0){
			client.end();
			res.statusCode = 404;
			res.send('This product is not in auction.');
		}
		
		else{
			//if product is on auction, check current bids on item
			//save the item's instant price for future reference
			
			var instantPrice = result.rows[0].pprice;

			var query2 = client.query("SELECT bids.*, auction.aucitemid AS pid, auction.aucstartbid FROM bids, auction WHERE bids.pid = auction.aucitemid AND pid ="+req.params.pid);
			
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {

				//removing '$' character from monetary values
				var instaPrice = instantPrice.substring(1);
				var startingBid = (result.rows[0].aucstartbid).substring(1);
				
				//product has no bids
				if(result.rows.length == 0){
					//check that bid price is lower than instant price
					if(instaPrice <= req.body.bid){
						client.end();
						res.send(400, 'Bid price must be lower than the instant price ' + instantPrice);
					}
					//check that bid is at least the starting bid
					else if(req.body.bid < startingBid){
						client.end();
						res.send(400, 'Bid price must be greater than the starting bid ' + result.rows[0].aucstartbid);
					}
					//bid value is a-okay, add to bids
					else{
						var query3 = client.query("INSERT INTO bids(bidderid, pid, bvalue) VALUES("+req.body.id +", " + req.params.pid +", " + req.body.bid + ");");
								
						query3.on("end", function (result) {
							client.end();
							res.statusCode = 200;
							res.send('Bid accepted.');
						});
					}
				}
				else{
					//product already has bids
					
					//bid entered is too high
					if(instaPrice <= req.body.bid){
						client.end();
						res.send(400, 'Bid price must be lower than the instant price ' + instantPrice);
					}
				
					else{
						//bid is lower than instant price, now check that bid is higher than the current max bid
						var query3 = client.query("SELECT MAX(bvalue) FROM bids WHERE pid = "+req.params.pid);
						
						query3.on("row", function (row, result) {
							result.addRow(row);
						});
						
						query3.on("end", function (result){
							//bid entered not high enough
							
							//removing '$' character from monetary values
							var maxCurrentBid = (result.rows[0].max).substring(1);
							
							if(maxCurrentBid >= req.body.bid){
								client.end();
								res.statusCode = 400;
								res.send('Bid price must be higher than the current maximum bid ' + result.rows[0].max+ '.');
							}
							else{
								//bid value is OK, create new entry in bids
								var query4 = client.query("INSERT INTO bids(bidderid, pid, bvalue) VALUES("+req.body.id +", " + req.params.pid +", '" + req.body.bid + "');");
								
								query4.on("end", function (result) {
									res.statusCode = 200;
									res.send('Bid accepted.');
								});
							}
						});
					}
				}
			});
		}
	});
});

//add item to cart
app.post("/addtocart", function(req,res){
	if(req.body.qty == 0 || req.body.qty == ""){
		res.statusCode = 400;
		res.json("Please specify a quantity");
	}
	
	console.log("Add item " + req.body.pid + "(" + req.body.qty + ") to " + req.body.username + "'s cart request received.");
	
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
			var query2 = client.query("SELECT * FROM products WHERE pid ="+req.body.pid);
					
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {
				//product was found
				if(result.rows.length > 0){
					var query3 = client.query("SELECT * FROM carts WHERE pid = "+req.body.pid+" AND userid ="+req.body.id);
			
					query3.on("row", function (row, result) {
						result.addRow(row);
					});
			
					query3.on("end", function (result) {
						//item already in cart
						if(result.rows.length > 0){
							var query4 = client.query("UPDATE carts SET cquantity = cquantity + "+req.body.qty+" WHERE pid = "+req.body.pid+" AND userid ="+req.body.id);
							
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
							var query4 = client.query("INSERT INTO carts VALUES("+req.body.id+","+req.body.pid+","+req.body.qty+");");
							
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

//TODO
//app.del("/removefromcart", function(req,res){
//});

//places order
//TODO : remove item from cart if not found
//TODO : SQL
//TODO : check that qty in cart is not greater than available of product
//TODO : remove cart entry once processed, add entry to sales
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
//TODO: remove item from cart if not found in products
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
			var query2 = client.query("SELECT products.*, carts.cquantity FROM users, carts, products WHERE carts.pid = products.pid AND users.uid = carts.userid AND users.username ='"+req.body.username+"'");
			
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {
				if(result.rows.length > 0){
					var productList = result;
					
					//calculate total
					var query3 = client.query("SELECT SUM(pprice*cquantity) FROM users, carts, products WHERE carts.pid = products.pid AND users.uid = carts.userid AND users.username ='"+req.body.username+"'");
					
					query3.on("row", function (row, result) {
						result.addRow(row);
					});
					
					query3.on("end", function (result) {
						var totalPrice = result.rows[0].sum;
						client.end();
						res.statusCode = 200;
						res.json({"cart":productList.rows,"total":totalPrice});
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
			var query2 = client.query("SELECT products.*, sellers.username AS sellername FROM users, users as sellers, bids, products "+
										"WHERE (users.uid = bids.bidderid) AND (bids.pid = products.pid) AND users.username = '"+req.body.username+"' AND sellers.uid = products.psellerid ");

			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {
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

//get ratings
app.post("/ratings", function(req,res){
	console.log("Get " + req.body.sellername + "'s ratings request received.");
	
	var client = new pg.Client(conString);
	client.connect();
	
	var query = client.query("SELECT * FROM users WHERE username = '" + req.body.username + "'");
	query.on("row", function(row,result){
		result.addRow(row);
	});
	query.on("end", function(result){
		if(result.rows[0].upassword == req.body.password){
			var query2 = client.query("SELECT username, rvalue FROM ratings,users WHERE users.username = '" + req.body.sellername + "' AND ratings.sellerid = users.uid");
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


//add rating
app.post("/addrating", function(req,res){
	if(req.body.qty == 0 || req.body.qty == ""){
		res.statusCode = 400;
		res.json("Please specify a quantity");
	}
	
	console.log("Add rating for seller " + req.body.sid + " from user " + req.body.id +  " request received.");
	
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
			var query2 = client.query("SELECT * FROM ratings WHERE raterid ="+req.body.uid);
					
			query2.on("row", function (row, result) {
				result.addRow(row);
			});
			
			query2.on("end", function (result) {
				//user has already rated once
				if(result.rows.length == 1){
					//TODO ??
				}
				
				else{
					client.query("INSERT INTO ratings (sellerid, raterid, rvalue) VALUES (" + req.body.sid + ", " + req.body.uid + ", " + req.body.rating + ") ");
				}
					
			});	
		}
	});
});


//TODO
//REST API for rating system********************************************************************

console.log("Server started. Listening on port 8888.");
app.listen(8888);