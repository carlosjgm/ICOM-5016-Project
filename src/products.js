function Product(name, category, price, description, model, photo, brand, dimensions){
	this.id = "";
	this.name = name;
	this.category = category;	
	this.price = price;
	this.description = description;
	this.model = model;
	this.photo = photo;
	this.brand = brand;
	this.dimensions = dimensions;
}

exports.Product = Product;