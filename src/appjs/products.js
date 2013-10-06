function Product(name, category, instantprice, description, model, photo, brand, dimensions, seller, nextbidprice){
	this.id;
	this.name = name;
	this.category = category;	
	this.instantprice = instantprice;
	this.description = description;
	this.model = model;
	this.photo = photo;
	this.brand = brand;
	this.dimensions = dimensions;
	this.seller = seller;
	this.nextbidprice = nextbidprice; 
	this.bidders = new Array();
}

exports.Product = Product;
