function Sale(name, category, revenue, seller, buyer, date, img, qty){
	this.id = "";
	this.name = name;
	this.category = category;	
	this.revenue = revenue;
	this.date = date;
	this.seller = seller;
	this.img = img;
	this.buyer = buyer;
	this.qty = qty;
	
	this.day = date.getDate();
	this.month = date.getMonth() + 1;
	this.year = date.getFullYear();
}

exports.Sale = Sale;
