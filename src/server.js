var express = require('express');
var app = express();

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

//User(username, password, email)
var userList = new Array(
	new User("carlosjgm", "123", "carlosjgm@gmail.com"),
	new User("susyspider", "456", "susy@spider.com"),
	new User("randaniel", "789", "randaniel@me.com"),
	new User("user", "user", "user@icom5016.com"),
	new User("admin", "admin", "admin@icom5016.com")
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

var creditCards = require('./appjs/creditcard');
var creditCard = creditCards.creditCard;

//creditCard(holdername, carnum, ccv, expday, expmonth, expyear)
var cCardList = new Array(
	new creditCard("Carlos J. Gomez", "1234123412341234", "123","1","1","2014"),
	new creditCard("Susana C. Galicia", "4567456745674567", "456", "4", "4", "2014"),
	new creditCard("Randy Soto", "7890789078907890", "789", "7", "7", "2014")
);
for (var i=0;i<cCardList.length;i++)
	userList[i].creditcard.push(cCardList[i]);

//sales
var sales = require('./appjs/sales');
var Sale = sales.Sale;

//Sale(name, category, revenue, seller, buyer, date, photo)
var salesList = new Array(
	new Sale("Alice in Wonderland", "books-children", 15, "carlosjgm", "user", new Date(), 'http://g-ecx.images-amazon.com/images/G/01/ciu/3a/67/ba0d90b809a064d76bbc6110.L._SY300_.jpg'),
	new Sale("pokemon tshirt", "clothing-children", 9, "carlosjgm", "user", new Date(2003,5,17), 'http://ecx.images-amazon.com/images/I/41X39Cf26rL._SL246_SX190_CR0,0,190,246_.jpg')
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

// Authenticator
function authorized(user, pass) {
	for (var i=0; i < userList.length; ++i){
		if (userList[i].username == user)
			if(userList[i].password == pass){
				return true;
			}
			else
				return false;
		
	}
	return false;
};


//REST API for products**************************************************************************************************************************

//browse product by category------------------------------------------------------
app.get('/browse/:category', function(req, res){
	console.log("Get " + req.params.category + " products request received.");
	
	var templist = new Array();
	var product;
	
	//search by category
	if(req.params.category != 'all'){
		for(var i=0;i<productList.length;i++){
			product = productList[i];
			if(product.category == req.params.category)
				templist.push(product);
		}
	}
	else
		templist = productList;
		
	res.json({"products" : templist});
});

//get product by id-----------------------------------------------------
app.get('/product/:id', function(req, res){
	console.log("Get product " + req.params.id + " request received.");
	if(productList.length <= req.params.id || req.params.id < 0){
		res.statusCode = 404;
		res.send('No such product found.');
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
			res.send('No such product found.');
		}
		else{
			var product = productList[target];
			res.statusCode = 200;
			res.json({"product":product});	
		}
	}	
});

//new product-------------------------------------------------
app.post('/newproduct', function(req, res) {
	console.log("Add new product request received.");
	if(!authorized(req.body.username, req.body.password))
		res.send("Unauthorized");
	else{
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
  	if(req.body.username == "" || req.bodypassword == ""){
		res.statusCode = 400;
		res.send('The form has missing fields.');
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
			res.statusCode = 404;
			res.send("Username/password entered not valid.");			
		}	
		else if(userList[target].password == req.body.password) {	
			res.statusCode = 200;
			res.json(true);
		}
		else{
			res.statusCode = 404;
			res.send("Username/password entered not valid.");
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
			var newUser = new User(req.body.newusername, req.body.newpassword, req.body.newemail);
			newUser.id = userNextId++;
			newUser.fname = req.body.newfname;
			newUser.lname = req.body.newlname;
			newUser.email = req.body.newemail;
			newUser.address.push(new Address(
				req.body.newaddress1,
				req.body.newaddress2,
				req.body.newcity,
				req.body.newselectcountry,
				req.body.newzipcode,
				req.body.newselectstate));
			newUser.telephone = req.body.newphonenum;
			
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

//return sales report based on date and category
app.post("/sales", function(req,res){
	var fromDate = new Date(req.body.fromDate);
	var toDate = new Date(req.body.toDate);
	
	console.log("Sales report. Category: " + req.body.category + ". From: " + fromDate.toDateString()
					+ ". To: " + toDate.toDateString());
					
	if(fromDate.getFullYear=="" || toDate.getFullYear==""){
		res.statusCode = 400;
		res.send("Incorrect year format");
	}
	
	else{
		if(req.body['category']==null)
			req.body['category']='all';
			
		var templist = new Array(), result = new Array();
		var sale, temp, totalrevenue=0;
		
		//search by category
		if(req.body.category != 'all'){
			for(var i=0;i<salesList.length;i++){
				sale = salesList[i];
				if(sale.category == req.body['category'])
					templist.push(sale);
			}
		}
		else
			templist = salesList;
			
		//search by date
		for(var i=0;i<templist.length;i++){
			sale = templist[i];
			if(checkSalesDate(fromDate,toDate,sale.date)){
				totalrevenue += sale.revenue;
				result.push(sale);
			}
		}	
			
		res.statusCode = 200;
		res.json({"sales":result,"totalRevenue":totalrevenue,"totalSales":result.length});
	}
});

//returns true if item date is between fromDate and toDate
function checkSalesDate(fromDate,toDate,saleDate){
	return fromDate <= saleDate && toDate >= saleDate;
};

console.log("Server started. Listening on port 8888.");
app.listen(8888);