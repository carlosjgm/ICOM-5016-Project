function User(username, password, email){
	this.id = "";
	this.username = username;
	this.password = password;
	this.fname;
	this.lname;
	this.email = email;
	this.selling = new Array();
	this.bidding = new Array();
	this.cart = new Array();
	this.credicard = new Array();
	this.address = new Array();
	this.telephone = new Array();
	}

exports.User = User;