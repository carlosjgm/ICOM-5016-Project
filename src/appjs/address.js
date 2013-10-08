function Address(id,line1,line2,city,country,zipcode,state){
	this.id = id;
	this.line1 = line1;
	this.line2 = line2;
	this.city = city;
	this.country = country;
	this.zipcode = zipcode;
	this.state = state;
};

exports.Address = Address;