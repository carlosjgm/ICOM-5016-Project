function creditCards(id, holdername, carnum, ccv, expmonth, expyear){
	this.id = id;
	this.holdername = holdername;
	this.carnum = carnum;
	this.ccv = ccv;
	this.expmonth = expmonth;
	this.expyear = expyear;
};

exports.creditCards = creditCards;