function User(username, password, email){
	this.id = "";
	this.username = username;
	this.password = password;
	this.avatar;
	this.fname;
	this.lname;
	this.email = email;
	this.selling = new Array();
	this.bidding = new Array();
	this.cart = new Array();
	this.creditcard = new Array();
	this.address = new Array();
	this.telephone;
	this.rating = new Array();
	this.sales = new Array();
	}

exports.User = User;