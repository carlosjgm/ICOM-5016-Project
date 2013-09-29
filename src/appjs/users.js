function User(username, password, email){
	this.id = "";
	this.username = username;
	this.password = password;
	this.email = email;
	this.selling = new Array();
	this.bidding = new Array();
	this.cart = new Array();
}

exports.User = User;