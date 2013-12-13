//******************************************************************************************************//
//											APP.JS													//
//******************************************************************************************************//

//load the complete product list to the browse page
$(document).on('pagebeforeshow', "#browse", function() {
	browseCategories('all');
});

//load today's sales list
$(document).on('pagebeforeshow', "#sales", function() {
	salesCategories('all');
});

//load credit card list
$(document).on('pagebeforeshow', "#manage-credit-cards", function() {
	getCreditCards();
});

//load address list
$(document).on('pagebeforeshow', "#manage-addresses", function() {
	getAddresses();
});

//load bidding list
$(document).on('pagebeforeshow', "#bidding", function() {
	loadBids();
});

//load items in catalog
$(document).on('pagebeforeshow', "#sellercatalogpage", function() {
	getSellerCatalogItems(localStorage["seller"]);
});

$(document).on('pagebeforeshow', "#product", function() {
	$("#product").trigger("create");
});

$(document).on('pagebeforeshow', '#cart', function(){
	loadCart();
});

//show info button: if logged in, shows username and on click goes to profile page; if not logged in, on click goes to login page
function profilebutton(buttonid,pagepanel){
	var user = localStorage.getItem("username");
	
	if(user != null)
			$(buttonid).replaceWith("<a id='" + buttonid + "' href='" + pagepanel + "' data-role='button' data-icon='bars' data-mini='true'"
				+ "data-inline='true'>" + user + "</a>");	
	else
		$(buttonid).replaceWith("<a id='" + buttonid + "' data-role='button' href='#login' data-theme='b' data-icon='checkbox-on' data-mini='true' data-iconpos='right' data-rel='popup' data-position-to='window' data-transition='pop'>Login</a>");

};

//add username, password to data
function addAuth(data){
	data.username = localStorage["username"];
	data.password = localStorage["password"];
	data.id = localStorage["id"];
	data.utype = localStorage["utype"];
	return data;
}

//submit login form and save username/password in local storage if successful
function login(){
	$.mobile.loading("show");
	var form = $("#login-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);
	var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/login" ,
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var user = data.user;
			localStorage.setItem("username", user.username);
			localStorage.setItem("password", user.upassword);
			localStorage.setItem("id", user.uid);
			localStorage.setItem("fname", user.ufname);
			localStorage.setItem("lname", user.ulname);
			localStorage.setItem("avatar", user.uavatar);
			localStorage.setItem("utype", user.utype);
			$.mobile.loading("hide");
			$.mobile.changePage("#browse", {reloadPage : true});
			$.mobile.changePage("#browse", {reloadPage : true});
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$("#invalid").replaceWith("<br /><p id='invalid' style='color:red'>"+data.responseText+"</p>");
			alert(data.responseText);
		}
	});	
};

//logout from account
//goes to browse page
function logout(){
	localStorage.removeItem("username");
	localStorage.removeItem("password");
	localStorage.removeItem("id");
	localStorage.removeItem("fname");
	localStorage.removeItem("lname");
	localStorage.removeItem("avatar");
	$.mobile.changePage("#browse", {reloadPage : true, transition : "none"});
};

//resets password trhough email
//submits reset-form
//goes to browse page
//TODO use express-mailer to send email
function reset(){
	$.mobile.loading("show");
	var form = $("#reset-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);
	var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/reset" ,
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert(JSON.stringify(data.user));
			$.mobile.changePage("#browse",{reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

//register new user and save username/password in local storage if successful
//submits registration-form
//goes to #browse if successful
//TODO use express-mailer to send email 
//TODO handle addresses
function register(){
	$.mobile.loading("show");
	var form = $("#registration-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);
	var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/register" ,
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			var user = data.user;
			localStorage.setItem("username", user.username);
			localStorage.setItem("password", user.upassword);
			localStorage.setItem("id", user.uid);
			localStorage.setItem("fname", user.ufname);
			localStorage.setItem("lname", user.ulname);
			localStorage.setItem("avatar", user.uavatar);
			$.mobile.loading("hide");
			$.mobile.changePage("#browse",{reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			$("#register-invalid").replaceWith("<br /><p id='invalid' style='color:red'>"+data.responseText+"</p>");
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

function addNewCard(){
	$.mobile.loading("show");
	var form = $("#newcard-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);
	//
	logdata = addAuth(logdata);
	var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/newcard/",
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			$.mobile.changePage("#manage-credit-cards", {reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			//$("#register-invalid").replaceWith("<br /><p id='invalid' style='color:red'>"+data.responseText+"</p>");
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

//TODO create #updatecard-form in index.html
function updateCard(ccid){
	$.mobile.loading("show");
	
	//var form = $("#updatecard-form");
	//var formData = form.serializeArray();
	//var logdata = ConverToJSON(formData);
	//logdata = addAuth(logdata);
	//var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/cards/"+ccid,
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.changePage("#manage-credit-cards", {reloadPage : true});
			alert('Card updated.');
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);
		}
	});
};

function removeCard(ccid){
	$.mobile.loading("show");
	
	var data = new Object();
	data = addAuth(data);
	var jsondata = JSON.stringify(data);
	
	$.ajax({
		url : "http://localhost:8888/cards/"+ccid,
		data : jsondata,
		method: 'delete',
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			$.mobile.changePage("#manage-credit-cards", {reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			//$("#register-invalid").replaceWith("<br /><p id='invalid' style='color:red'>"+data.responseText+"</p>");
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

//Gets all credit cards associated with one user
function getCreditCards(){	
	$.mobile.loading("show");
	
	var data = new Object();
	data = addAuth(data);
	var jsondata = JSON.stringify(data);
	
	$.ajax({
		url : "http://localhost:8888/cards/",
		method: 'post',
		data: jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var cardList = data.cards; //check later
			var list = $("#credit-card-list");
			list.empty();
			var card;
			
			for (var i=0; i < cardList.length; ++i){
			card = cardList[i];
				list.append("<li>"
					+ "<a href='#edit-card' data-role='button' data-rel='popup' data-transition='pop'>"
					+ "<h3>Card Holder Name: " + card.ccholdername + "</h3>"
					+ "<p> Card Num: " + "XXXX-XXXX-XXXX-"+card.ccnum[12]+card.ccnum[13]+card.ccnum[14]+card.ccnum[15]+ "</p>"
					+ "<p>Expiration Date: " + card.ccexpmonth + "/" + card.ccexpyear
					+ "</p><a href='#manage-credit-cards' data-role='button' data-icon='delete' onclick='removeCard("+ card.ccid +")'>Remove card</a></a></li>");
			}
			list.listview("refresh");	
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("You have no credit cards :(");			
		}
	});	
};

//TODO ? if implemented, needs setPrimaryAddress too
function getPrimaryAddress(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:8888/addresses/"+ id,
		method: 'get',
		success : function(data, textStatus, jqXHR){
			var addressList = data.addresses; //check later
			var list = $("#credit-card-list");
			list.empty();
			var card;
			
			for (var i=0; i < cardList.length; ++i){
			card = cardList[i];
				list.append("<li><a>"
					+ "<h3>Card Holder Name: " + card.holdername + "</h3>"
					+ "<p> Card Num: " + "XXXX-XXXX-XXXX-"+card.carnum[12]+card.carnum[13]+card.carnum[14]+card.carnum[15]+ "</p>"
					+ "<p>Expiration Date: " + card.expmonth + "/" + card.expyear
					+ "</p><a href='#manage-credit-cards' data-role='button' data-icon='delete' onclick='removeCard("+ card.carnum +")'>Remove card</a></a></li>");
			}
			list.listview("refresh");	
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("You have no credit cards :(");			
		}
	});	
};

function addNewAddress(){
	$.mobile.loading("show");
	var form = $("#newaddress-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);
	logdata = addAuth(logdata);
	var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/newaddress/",
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			$.mobile.changePage("#manage-addresses", {reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

function getAddresses(){
	$.mobile.loading("show");
	
	var data = new Object();
	data = addAuth(data);
	var jsondata = JSON.stringify(data);
	
	$.ajax({
		url : "http://localhost:8888/addresses/",
		data : jsondata,
		method: 'post',
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var addressList = data.addresses;
			console.log(JSON.stringify(addressList));
			var list = $("#address-list");
			list.empty();
			var address;
			
			for (var i=0; i < addressList.length; ++i){
			address = addressList[i];
				list.append('<li><a href="#edit-address" data-role="button" data-theme="b" data-icon="plus" data-iconpos="right" data-rel="popup" data-position-to="window" data-transition="pop">'
					+ "<h3>" + localStorage.getItem("fname") + " " + localStorage.getItem("lname") + "</h3>"
					+ "<p>" + address.aline1 + "<br/>" + address.aline2 + "</p>"
					+ "<p>" + address.acity + ", " + address.astate + "</p>"
					+ "<p>" + address.acountry + ", " + address.azipcode
					+ "</p><a href='#manage-addresses' data-role='button' data-icon='delete' onclick='removeAddress("+ address.aid +")'>Remove address</a></a></li>");
			}
			list.listview("refresh");	
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("You have no addresses :(");			
		}
	});	
};

//TODO create #updateaddress-form in index.html
function updateAddress(aid){
	$.mobile.loading("show");
	
	var form = $("#updatecard-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);
	logdata = addAuth(logdata);
	var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/address/"+aid,
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.changePage("#manage-credit-cards", {reloadPage : true});
			alert('Card updated.');
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);
		}
	});
};

function removeAddress(aid){
	$.mobile.loading("show");
	
	var data = new Object();
	data = addAuth(data);
	var jsondata = JSON.stringify(data);
	
	$.ajax({
		url : "http://localhost:8888/addresses/"+aid,
		method: 'delete',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			$.mobile.changePage("#manage-addresses", {reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

//updates password
function updatePassword(){
	$.mobile.loading("show");
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"],"updpassword":document.getElementById("updpassword").value});
	$.ajax({
		url : "http://localhost:8888/password" ,
		method: 'post',
		data : data,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			localStorage.setItem("password", document.getElementById("updpassword").value);
			$.mobile.loading("hide");
			alert("Password changed.");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);
		}
	});
};

//updates avatar
function updateAvatar(){
	$.mobile.loading("show");
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"],"updavatar":document.getElementById("updavatar").value});
	$.ajax({
		url : "http://localhost:8888/avatar" ,
		method: 'post',
		data : data,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			localStorage.setItem("avatar", document.getElementById("updavatar").value);
			$.mobile.loading("hide");
			alert("Avatar updated.");
			$.mobile.changePage("#browse", {reloadPage : true});
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);
		}
	});
};

//add to shopping cart
//goes to #cart
function addToCart(pid){
	$.mobile.loading("show");	
	var qty = document.getElementById("quantity").value;
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"],"id":localStorage["id"],"pid":pid,"qty":qty});
	$.ajax({
		url: "http://localhost:8888/addtocart",
		method: 'post',
		data : data,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			alert("Item added to cart.");
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);
		}
	});	
};

//TO FIX: refresh issue on chrome
function removeFromCart(pid){
	$.mobile.loading("show");
	
	var data = new Object();
	data = addAuth(data);
	data.pid = pid;
	var jsondata = JSON.stringify(data);
	
	$.ajax({
		url : "http://localhost:8888/removefromcart/",
		method: 'delete',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert("Item was succesfully removed from cart.");
			$.mobile.changePage("#cart", {reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

function loadCart(){	
	$.mobile.loading("show");
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"]});
	
	$.ajax({
		url : "http://localhost:8888/loadcart",
		method: 'post',
		data : data,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var cartList = data.cart;
			var content = $("#cart-content");
			content.empty();
			var cartItem;
			for (var i=0; i < cartList.length; ++i){
				cartItem = cartList[i];
				content.append("<li><h3>" + cartItem.pname + "</h3>"
				+ "<p>Quantity: " + cartItem.cquantity
				+ "<p>Price: " + cartItem.pprice + "</p>"
				+ "<input type='button' onclick='removeFromCart(" + cartItem.pid + ")' value='Delete'></li>");				
			}
			content.append("<li data-theme='f'><p><h2>Shipping: Free Shipping!</h2></p><p><h2>Total: " + data.total + "</h2></p>"
						+ "<input type='button' onclick='checkout()' value='Checkout'></li>");
			content.listview("refresh");	
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);			
		}
	});	
};

//Next bid price: Max bid + some offset
function loadBids(){	
	$.mobile.loading("show");
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"]});
	$.ajax({
		url : "http://localhost:8888/loadbids",
		method: 'post',
		data : data,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var bidList = data.bids;
			var content = $("#bidding-list");
			content.empty();
			var bidItem;
			for (var i=0; i < bidList.length; ++i){
				bidItem = bidList[i];
				
			content.append("<img src='" + bidItem.pphoto + "' style='float: left; clear: left; margin-top: 5px; margin-right: 15px; margin-left: -30px' width='65' height='65' border='0px' />");
			content.append("<div style='text-align: left;'><b>" + bidItem.pname + "</b></div>");
			content.append("<div id='item-seller' style='text-align: left;'>Seller: <a id='gotoSeller' >" + bidItem.sellername + "</a></div>");
			content.append("<div id='item-bid' data-mini='true' style='text-align: left;'>Current bid: $" + bidItem.nextbidprice + "</div></div>"); 
			content.append("<div data-type='vertical' style='float: right; margin-top: -50px;'>"
				+ "<input type='button' href='#bidpopup' data-theme='e' data-rel='popup' data-position-to='window' data-transition='pop' value='Increase Bid'/></div></li><br/><hr style='margin-left: -41px;'>");			
			}
			
			content.listview("refresh");	
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);			
		}
	});	
};

//TODO needs a page in index.html, namely #product-bidding-list
function loadProductBids(pid){	
	$.mobile.loading("show");
	
	var data = new Object();
	data = addAuth(data);
	data.pid = pid;
	var jsondata = JSON.stringify(data);
	
	
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"]});
	$.ajax({
		url : "http://localhost:8888/loadproductbids",
		method: 'post',
		data : data,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var bidList = data.bid;
			var content = $("#product-bidding-list");
			content.empty();
			var bidItem;
			for (var i=0; i < bidList.length; ++i){
				bidItem = bidList[i];
				
			content.append("<img src='" + bidItem.photo + "' style='float: left; clear: left; margin-top: 5px; margin-right: 15px; margin-left: -30px' width='65' height='65' border='0px' />");
			content.append("<div style='text-align: left;'><b>" + bidItem.name + "</b></div>");
			content.append("<div id='item-seller' style='text-align: left;'>Seller: <a id='gotoSeller' >" + bidItem.seller + "</a></div>");
			content.append("<div id='item-bid' data-mini='true' style='text-align: left;'>Current bid: $" + bidItem.nextbidprice + "</div></div>"); 
			content.append("<div data-type='vertical' style='float: right; margin-top: -50px;'>"
				+ "<input type='button' href='#bidpopup' data-theme='e' data-rel='popup' data-position-to='window' data-transition='pop' value='Increase Bid'/></div></li><br/><hr style='margin-left: -41px;'>");			
			}
			content.listview("refresh");	
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);			
		}
	});	
};

//Get Seller Catalog Items
function getSellerCatalogItems(user){	
	//var seller = localStorage.setItem["seller",user];
	$.mobile.loading("show");
	var data = new Object();
	data = addAuth(data);
	
	if(user == undefined){
		data.sellername = localStorage["username"];
	}
	else{		
		data.sellername = user;
	}
	var jsondata = JSON.stringify(data);
	$.ajax({
		url : "http://localhost:8888/catalog",
		method: 'post',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.products;
			var content = $("#catalog");
			content.empty();
			var product;
			for (var i=0; i < itemList.length; ++i){
				product = itemList[i];		
				content.append("<a onclick='loadProductPage(" + product.pid + ")'><img src='" + product.pphoto + "' style='float: left; clear: left; margin-top: 5px; margin-right: 15px; margin-left: -30px' width='65' height='65' border='0px' />"
							+"<div style='text-align: left;'><b>" + product.pname + "</b></div>"
							+"<div id='item-bid' data-mini='true' style='text-align: left;'>Price: " + product.pprice + "<br/></div></div></a><br/><hr style='margin-left: -41px;'></a>");			
			}
			var seller = $("#sellerinfo");
			seller.empty();
			seller.append(product.username);
			
			var rateButton = $("#rateseller");
			rateButton.empty();
			rateButton.append("<a onclick='submitRating("+product.sid+")'>Submit</a>");
			
			var ratPercent = $("#sellercatrating");
			ratPercent.empty();
			ratPercent.append(data.percent);
			
			content.listview("refresh");
			rateButton.listview("refresh");
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);			
		}
	});	
};

//Get User Catalog Items
function getUserCatalogItems(){	
	$.mobile.loading("show");
	var data = new Object();
	data = addAuth(data);
	data.sellername = localStorage["username"];
	
	var jsondata = JSON.stringify(data);
	$.ajax({
		url : "http://localhost:8888/catalog",
		method: 'post',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.products;
			var content = $("#usercatalog");
			content.empty();
			var product;
			for (var i=0; i < itemList.length; ++i){
				product = itemList[i];		
				content.append("<a onclick='loadProductPage(" + product.pid + ")'><img src='" + product.pphoto + "' style='float: left; clear: left; margin-top: 5px; margin-right: 15px; margin-left: -30px' width='65' height='65' border='0px' />"
							+"<div style='text-align: left;'><b>" + product.pname + "</b></div>"
							+"<div id='item-bid' data-mini='true' style='text-align: left;'>Price: " + product.pprice + "<br/></div>"
							+"<input type='button' onclick='removeProduct("+product.pid+")' value='Delete Product'>"
							+"<a href='#update-product'><input type='button' onclick='updateProduct("+product.pid+")' style='margin-left: 10px;' value='Update'></a></div></a><br/><hr style='margin-left: -41px;'></a>");			
			}
			var seller = $("#userinfo");
			seller.empty();
			seller.append(product.username);
			
			var ratPercent = $("#usercatrating");
			ratPercent.empty();
			ratPercent.append(data.percent);
			
			content.listview("refresh");	
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);			
		}
	});	
};

//checkout
function checkout(){
	$.mobile.loading("show");
	$.mobile.changePage("#checkout");
	
	var data = new Object();
	data = addAuth(data);
	var jsondata = JSON.stringify(data);
	
	$.ajax({
		url : "http://localhost:8888/checkitout",
		method: 'post',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			//$.mobile.loading("hide");
			var userdata = data.userdata;
			var total = data.total;
			var cart = data.products;
			
			var content = $("#checkout-address");
			content.empty();
			content.append("<h3>" + localStorage.getItem("fname") + " " + localStorage.getItem("lname") + "</h3>"
						 + "<p>" + userdata.aline1 + "<br/>" + userdata.aline2 + "</p>"
						 + "<p>" + userdata.acity + ", " + userdata.astate + "</p>"
						 + "<p>" + userdata.acountry + ", " + userdata.azipcode);
						 
			content = $("#checkout-ccard");
			content.empty();
			content.append("<a data-role='button' data-rel='popup' data-transition='pop'>"
						 + "<h3>Card Holder Name: " + userdata.ccholdername + "</h3>"
						 + "<p> Card Num: " + "XXXX-XXXX-XXXX-"+userdata.ccnum[12]+userdata.ccnum[13]+userdata.ccnum[14]+userdata.ccnum[15]+ "</p>"
						 + "<p>Expiration Date: " + userdata.ccexpmonth + "/" + userdata.ccexpyear + "</a>");
			
			content = $("#checkout-items");
			content.empty();
			for (var i=0; i < cart.length; ++i){
				content.append("<li><h3>" + cart[i].pname + "</h3>"
				+ "<p>Quantity: " + cart[i].cquantity
				+ "<p>Price: " + cart[i].pprice + "</p>");				
			}
			
			content = $("#checkout-total");
			content.empty();
			content.append("Order total: "+total);

			content.listview("refresh");	
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);
		}
	});
};

//places order
function placeOrder(){
	$.mobile.loading("show");
	var data = new Object();
	data = addAuth(data);
	var jsondata = JSON.stringify(data);
	
	$.ajax({
		url : "http://localhost:8888/placeorder",
		method: 'post',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("Order placed.");
		},
		error : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);
		}
	});
};

//bid on item id
function placebid(pid){
	$.mobile.loading("show");
	var bid = document.getElementById("offerbid").value;
	var jsondata = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"],"id":localStorage["id"], "bid":bid});

	$.ajax({
			url : "http://localhost:8888/bid/" + pid ,
			method: 'post',
			data : jsondata,
			contentType: "application/json",
			dataType: "json",
			success : function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				alert("Bid accepted.");				
				loadProductPage(pid);
			},
			error: function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				alert(data.responseText);
			}
		});	
};

//TODO: Needs SERIOUS fixing. Sometimes it's not even entering here when you click on the form submit button
function submitRating(sid){
	$.mobile.loading("show");
	
	var form = $("#rating-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);	
	logdata = addAuth(logdata);	
	logdata.sid = sid;
	var jsondata = JSON.stringify(logdata);	
		
		alert(jsondata);
		
	$.ajax({
			url : "http://localhost:8888/addrating/",
			method: 'post',
			data : jsondata,
			contentType: "application/json",
			dataType: "json",
			success : function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				alert("Thank you for your feedback.");	
			},
			error: function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				alert(data.responseText);
			}
		});	
	
	
};

//TODO: gets user comments and ratings of a seller, needs a page in index.html
/*function getRatings(user){
	$.mobile.loading("show");
	var data = new Object();
	//data = addAuth(data);
	data.sellername = user;
	var jsondata = JSON.stringify(data);
	$.ajax({
		url : "http://localhost:8888/ratings",
		method: 'get',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			//
			$.mobile.loading("hide");
		},
		
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);			
		}
}; */


function getRatings(user){	
	//var seller = localStorage.setItem["seller",user];
	$.mobile.loading("show");
	var data = new Object();
	
	if(user == undefined){
		data.sellername = localStorage["username"];
	}
	else{		
		data.sellername = user;
	}
	var jsondata = JSON.stringify(data);
	$.ajax({
		url : "http://localhost:8888/ratings",
		method: 'post',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var ratingList = data.ratings;
			var content = $("#ratings");
			content.empty();
			var rating;
			for (var i=0; i < ratingList.length; ++i){
				rating = ratingList[i];		
				content.append("<li><b>" + rating.raterid + "</b></li>"
							+"<li>rated <a href=>" + rating.sellerid + "</a> with " + rating.rvalue + " Stars</li>"
							+"<li>" + rating.rcomment + "</li>"
							+"<hr style='margin-left: -41px;'><br>");			
			}
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);			
		}
	});	
};

//adds new product
function newProduct(){
	$.mobile.loading("show");
	var form = $("#newproduct-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);	
	logdata = addAuth(logdata);	
	
	logdata.newauctstart = new Date(logdata["newfromauctyear"],logdata["newfromauctmonth"],logdata["newfromauctday"]);
	logdata.newauctend = new Date(logdata["newtoauctyear"],logdata["newtoauctmonth"],logdata["newtoauctday"]);
	
	var logdatajson = JSON.stringify(logdata);
	$.ajax({
		url : "http://localhost:8888/newproduct/",
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert("Product added.");
			$.mobile.changePage("#browse", {reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

//TODO add updateproduct-form in index.html
function updateProduct(pid){
	$.mobile.loading("show");

	var form = $("#updateproduct-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);
	logdata = addAuth(logdata);
	var logdatajson = JSON.stringify(logdata);

	$.ajax({
		url : "http://localhost:8888/product/" + pid,
		method: 'post',
		data : logdatajson,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){			
			localStorage.setItem("", document.getElementById("").value);
			$.mobile.loading("hide");
			alert("Product updated.");
			$.mobile.changePage("#", {reloadPage : true});
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);
		}
	});
};

//Add: Ask user if he really REALLY wants to delete the product from the system.
function removeProduct(pid){
	$.mobile.loading("show");
	
	var data = new Object();
	data = addAuth(data);
	var jsondata = JSON.stringify(data);
	
	$.ajax({
		url : "http://localhost:8888/products/"+pid,
		method: 'delete',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			//$.mobile.changePage("#manage-products", {reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

//loads product page
//fills #product-content and goes to #product
function loadProductPage(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:8888/product/" + id ,
		method: 'get',
		success : function(data, textStatus, jqXHR){
			var product = data.product;
			var content = $("#product-content");
			content.empty();
			content.append("<img src='" + product.pphoto + "' style='float: left; clear: left; padding:10px 20px 0px 0px' width='65' height='65' border='0px' />"
				+ "<div style='text-align: left;'>" + product.pname + "</div>"
				+ "<div style='text-align: left;'>Price: " + product.pprice + "</div>"
				+ "<div item-seller' style='text-align: left;'>Seller: " + product.username + "</div>");
			if(product.forbid){
				content.append("<div id='item-bid' data-mini='true' style='text-align: left;'>Starting bid: " + product.aucstartbid + "</div></div>"); 
			}
			if(product.forbid){
				content.append("<div data-type='vertical' style='float: right; margin-right: -14px; margin-top: -100px;'>" 
					+ "<a data-role='button' href='#checkout' data-theme='e' data-icon='arrow-r' data-mini='true' data-iconpos='right' onclick='addToCart(" + product.pid + ")'>Buy now</a>"
					+ "<a data-role='button' href='#qtypopup' data-theme='b' data-icon='plus' data-mini='true' data-iconpos='right' data-rel='popup' data-position-to='window' data-transition='pop'>Add to cart</a>"
					+ "<a data-role='button' href='#bidpopup' data-theme='c' data-icon='arrow-r' data-mini='true' data-iconpos='right' data-rel='popup' data-position-to='window' data-transition='pop'>Place bid</a>"
					+ "<a data-role='button' href='#product-bidding-list' data-theme='c' data-icon='arrow-r' data-mini='true' data-iconpos='right'>Current bids</a></div>");
				var bidpopup = $("#my-bid");
				bidpopup.empty();
				bidpopup.append("<input type='number' id='offerbid' name='offerbid' data-mini='true' placeholder=' " + product.aucstartbid + "'/>");
				bidpopup.append("<a onclick='placebid(" + product.pid + ")' data-role='button' data-rel='back' data-theme='b'  data-inline='true' data-mini='true'>Place bid</a>"
				);
			}
			else{
				content.append("<div data-type='vertical' style='float: right; margin-right: -14px; margin-top: -70px;'>" 
					+ "<a data-role='button' href='#checkout' data-theme='e' data-icon='arrow-r' data-mini='true' data-iconpos='right' onclick='addToCart(" + product.pid + ")'>Buy now</a>"
					+ "<a data-role='button' href='#qtypopup' data-theme='b' data-icon='plus' data-mini='true' data-iconpos='right' data-rel='popup' data-position-to='window' data-transition='pop'>Add to cart</a>");
			}
			var seller = $("#visit-seller");
			seller.empty();
			seller.append("<a href='#sellercatalogpage' data-role='button'>Visit "+product.username+"'s page</a>");			
			localStorage["seller"] = product.username;
			//
			var qtypopup = $("#my-quantity");
			qtypopup.empty();
			qtypopup.append("<input type='number' id='quantity' name='quantity' data-mini='true' placeholder='0' value='1'/>");
			qtypopup.append("<a onclick='addToCart(" + product.pid + ")' data-role='button' data-rel='back' data-theme='b'  data-inline='true' data-mini='true'>Add to cart</a>");
			var desc = $("#product-description");
			desc.empty();
			desc.append("<div data-role='collapsible' data-collapsed='true'>"
					+ "<h4>Product Description</h4>"
					+ product.pdescription + "</div>"
					+ "<li>Model: " + product.pmodel + "</li>"	
					+ "<li>Brand: " + product.pbrand + "</li>"
					+ "<li>Product Dimensions: " + product.pdimensions + "</li>");
			$.mobile.loading("hide");
			$.mobile.changePage("#product");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);
		}
	});
};

//shows sales report
//submits sales-form and lists the summary on #sales-summary
//stores from/to dates in localvariable 
function submitSales(){
	$.mobile.loading("show");
	
	if(localStorage.getItem("salesInitialized")==undefined){
		localStorage.setItem("salesCategory",'all');
		localStorage.setItem("salesInitialized",true);
	}
	
	var form = $("#sales-form");
	var formData = form.serializeArray();	
	var logdata = ConverToJSON(formData);
	
	if(logdata["from-sales-year"]=="" || logdata["to-sales-year"]==""){
		alert("Please fill the year field.");
		$.mobile.loading("hide");
	}
	
	else{
		var fromDate = new Date(logdata["from-sales-year"],logdata["from-sales-month"],logdata["from-sales-day"]);
		var toDate = new Date(logdata["to-sales-year"],logdata["to-sales-month"],logdata["to-sales-day"]);
		
		localStorage.setItem("fromDate",fromDate);
		localStorage.setItem("toDate",toDate);
		
		var jsonData = JSON.stringify({"category":localStorage.getItem("salesCategory"),"fromDate":fromDate,"toDate":toDate});	
		$.ajax({
			url : "http://localhost:8888/sales" ,
			method: 'post',
			data : jsonData,
			contentType: "application/json",
			dataType: "json",
			success : function(data, textStatus, jqXHR){
				var salesList = data.sales;
				var list = $("#sales-list");
				var header = $("#sales-list-header");
				list.empty();
				header.empty();
				header.append("<li><h3>Category: " + localStorage.getItem("salesCategory") + ", From: " + fromDate.toDateString() 
					+ ", To: " + toDate.toDateString() + "</h3> Total Revenue: $" + data.totalRevenue 
					+ ", Total sales: "	+ data.totalSales + "</li>");
				var sale;
				for (var i=0; i < salesList.length; ++i){
					sale = salesList[i];
					list.append("<li><h2>" + sale.sname + " (" + sale.idate + ")</h2> Seller: "+ sale.seller +  
					", Buyer: " + sale.buyer + ", Quantity: " + sale.squantity + ", Price (1): " + sale.sprice + "</li>");
				}
				$.mobile.loading("hide");
				header.listview("refresh");
				list.listview("refresh");		
			},
			error: function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				alert("Data not found.");
			}
		});
	}
};

//replaces #sales-list with a list of sales from category
//stores category in localvariable
function salesCategories(category){
	$.mobile.loading("show");
	if(localStorage.getItem("salesInitialized")==undefined){
		var currentDate = new Date();
		var startDate = new Date();
		startDate.setHours(0,0,0,0);
			
		localStorage.setItem("fromDate",startDate);
		localStorage.setItem("toDate",currentDate);
		localStorage.setItem("salesInitialized",true);
	}
	
	localStorage.setItem("salesCategory", category);
	var fromDate = localStorage.getItem("fromDate");
	var toDate = localStorage.getItem("toDate");
	var jsonData = JSON.stringify({"category":category,"fromDate":fromDate,"toDate":toDate});
	$.ajax({
		url : "http://localhost:8888/sales" ,
		method: 'post',
		data : jsonData,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var salesList = data.sales;
			var list = $("#sales-list");
			var header = $("#sales-list-header");
			list.empty();
			header.empty();
			header.append("<li><h3>Category: " + category + ", From: " + (new Date(fromDate)).toDateString() 
					+ ", To: " + (new Date(toDate)).toDateString() + "</h3> Total Revenue: $" + data.totalRevenue 
					+ ", Total sales: "	+ data.totalSales + "</li>");
			var sale;
			for (var i=0; i < salesList.length; ++i){
				sale = salesList[i];
				list.append("<li><h2>" + sale.sname + " (" + sale.idate + ")</h2> Seller: "+ sale.seller +  
					", Buyer: " + sale.buyer + ", Quantity: " + sale.squantity + ", Price (1): " + sale.sprice + "</li>");
			}
			$.mobile.loading("hide");
			header.listview("refresh");
			list.listview("refresh");		
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert("Data not found.");			
		}
	});
};

function closePanel(id){
  $("#"+id).panel("close");
};

//replaces #product-list with a list of products from category
//stores category in localvariable
function browseCategories(category){	
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:8888/browse/" + category ,
		method: 'get',
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var list = $("#product-list");
			list.empty();
			list.append("<li data-role='list-divider'>"+category+"</li>");
			var product;
			for (var i=0; i < productList.length; ++i){
				product = productList[i];
				list.append("<li><a onclick='loadProductPage(" + product.pid + ")'><img src='" + product.pphoto + "' />"
					+ "<h3>" + product.pname + "</h3>"
					+ "<p> <strong>Brand:</strong> " + product.pbrand + "</p>"
					+ "<p><strong>Instant Price: </strong>" + product.pprice + "</strong>"
					+ "</p></a></li>");
					
			}
			list.listview("refresh");
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data not found!");			
		}
	});	
};


//Get Purchase History
function getPurchaseHistory(){	
	$.mobile.loading("show");
	var data = new Object();
	data = addAuth(data);
	data.sellername = localStorage["username"];
	
	var jsondata = JSON.stringify(data);
	$.ajax({
		url : "http://localhost:8888/purchases",
		method: 'post',
		data : jsondata,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var content = $("#purchases");
			content.empty();
			var product;
			for (var i=0; i < productList.length; ++i){
				product = productList[i];			
				content.append("<li><h3>" + product.sname + "</h3>"
					+ "<p><strong>Instant Price: </strong>" + product.sprice + "</strong>"
					+ "<p> <strong>Qty:</strong> " + product.squantity + "</p>"
					+ "</p></a></li><hr>");			
			}
					
			content.listview("refresh");	
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.textResponse);			
		}
	});	
};


//convert the form data to json format
function ConverToJSON(formData){
	var result = {};
	$.each(formData, 
		function(i, o){
			result[o.name] = o.value;
	});
	return result;
};
