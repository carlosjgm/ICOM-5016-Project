var express = require('express');
var app = express();

var products = require('./products');
var Product = products.Product;

var productList = new Array(
	new Product("shirt", "clothes:men", 19.99, "blue medium shirt", "","","medium"),
	new Product("hdtv", "electronics:tv", 499.99, "30 inches hd tv", "r450a","Sony","30 inches")
);

app.use(express.bodyParser());


//REST API for products

app.get('/', function(req, res){
	res.json(productList);
});

app.get('/product/:id', function(req, res){
	if(productList.length <= req.params.id || req.params.id < 0){
		res.statusCode = 404;
		return res.send('Error 404: No such product found.');
	}
	
	var product = productList[req.params.id];
	res.json(product);		
});

app.post('/product', function(req, res) {
	  if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('category') || !req.body.hasOwnProperty('price')
	   || !req.body.hasOwnProperty('description') || !req.body.hasOwnProperty('model') || !req.body.hasOwnProperty('photo')
	   || !req.body.hasOwnProperty('brand') || !req.body.hasOwnProperty('dimensions')) {
	  	    res.statusCode = 400;
		    return res.send('Error 400: Post syntax incorrect.');
	  }
	
	  var newProduct = {
		    name : req.body.name,
		    category : req.body.category,
		    price : req.body.price,
		    description : req.body.description,
		    model : req.body.model,
		    photo : req.body.photo,
		    brand : req.body.brand,
		    dimensions : req.body.dimensions
	  };
	
	  productList.push(newProduct);
	  res.json(true);
});

app.del('/product/:id', function(req, res) {
	  if(productList.length <= req.params.id || req.params.id < 0) {
		    res.statusCode = 404;
		    return res.send('Error 404: No such product found');
	  }
	
	  productList.splice(req.params.id, 1);
	  res.json(true);
});


//REST API for users

app.listen(process.env.PORT || 8888);