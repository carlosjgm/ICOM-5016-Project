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
	getCreditCards(localStorage["id"]);
});

//load address list
$(document).on('pagebeforeshow', "#manage-addresses", function() {
	getAddresses(localStorage["id"]);
});

//load bidding list
$(document).on('pagebeforeshow', "#bidding", function() {
	loadBids();
});

//load items in catalog
$(document).on('pagebeforeshow', "#catalogpage", function() {
	getCatalogItems();
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
	$.mobile.changePage("#browse", {reloadPage : true, transition : "none"});
};

//register new user and save username/password in local storage if successful
//submits registration-form
//goes to #browse if successful
//TODO use express-mailer to send email 
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
	var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/newcard/"+localStorage.getItem("id"),
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

function removeCard(carnum){
	$.mobile.loading("show");
	
	$.ajax({
		url : "http://localhost:8888/cards/"+carnum,
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
function getCreditCards(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:8888/cards/"+ id,
		method: 'get',
		success : function(data, textStatus, jqXHR){
			var cardList = data.cards; //check later
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
/**/

function getAddresses(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:8888/addresses/"+ id,
		method: 'get',
		success : function(data, textStatus, jqXHR){
			var addressList = data.addresses; //check later
			var list = $("#address-list");
			list.empty();
			var address;
			
			for (var i=0; i < addressList.length; ++i){
			address = addressList[i];
				list.append("<li><a>"
					+ "<h3>" + localStorage.getItem("fname") + " " + localStorage.getItem("lname") + "</h3>"
					+ "<p>" + address.line1 + "<br/>" + address.line2 + "</p>"
					+ "<p>" + address.city + ", " + address.state + "</p>"
					+ "<p>" + address.country + ", " + address.zipcode
					+ "</p><a href='#manage-addresses' data-role='button' data-icon='delete' onclick='removeAddress("+ i +")'>Remove address</a></a></li>");
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

function addNewAddress(){
	$.mobile.loading("show");
	var form = $("#newaddress-form");
	var formData = form.serializeArray();
	var logdata = ConverToJSON(formData);
	var logdatajson = JSON.stringify(logdata);
	
	$.ajax({
		url : "http://localhost:8888/newaddress/"+localStorage.getItem("id"),
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

function removeAddress(index){
	$.mobile.loading("show");
	
	$.ajax({
		url : "http://localhost:8888/addresses/"+index,
		method: 'delete',
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
			$.mobile.loading("hide");
			alert("Avatar changed.");
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			alert(data.responseText);
		}
	});
};

//add to shopping cart
//goes to #cart
function addToCart(id){
	$.mobile.loading("show");	
	var qty = document.getElementById("quantity").value;
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"],"id":id,"qty":qty});
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

//removes id from cart
//TODO
function removeFromCart(id){
	alert("Removed item from cart (not implemented)");
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
				content.append("<li><h3>" + cartItem.name + "</h3>"
				+ "<p>Quantity: " + cartItem.qty
				+ "<p>Price: $" + cartItem.instantprice + "</p>"
				+ "<input type='button' onclick='removeFromCart(" + cartItem.id + ")' value='Delete'></li>");				
			}
			content.append("<li data-theme='f'><p><h2>Shipping: $$$$</h2></p><p><h2>Total: $" + data.total + "</h2></p>"
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
			var bidList = data.bid;
			var content = $("#bidding-list");
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


//Get Catalog Items
function getCatalogItems(){	
	$.mobile.loading("show");
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"]});
	$.ajax({
		url : "http://localhost:8888/catalog",
		method: 'post',
		data : data,
		contentType: "application/json",
		dataType: "json",
		success : function(data, textStatus, jqXHR){
			var itemList = data.cat;
			var content = $("#catalog");
			content.empty();
			var product;
			for (var i=0; i < itemList.length; ++i){
				product = itemList[i];
		
				content.append("<a onclick='loadProductPage(" + product.id + ")'><img src='" + product.photo + "' style='float: left; clear: left; margin-top: 5px; margin-right: 15px; margin-left: -30px' width='65' height='65' border='0px' />"
							+"<div style='text-align: left;'><b>" + product.name + "</b></div>"
							+"<div id='item-bid' data-mini='true' style='text-align: left;'>Instant Price: $" + product.instantprice + "<br/> Bid Price: $" + product.nextbidprice + "</div></div></a><br/><hr style='margin-left: -41px;'></a>");			
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


//checkout
function checkout(){
	$.mobile.changePage("#checkout");
};

//places order
function placeOrder(){
	$.mobile.loading("show");
	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"]});
	$.ajax({
		url : "http://localhost:8888/placeorder",
		method: 'post',
		data : data,
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
function placebid(id){
	$.mobile.loading("show");
	var bid = document.getElementById("offerbid").value;

	var data = JSON.stringify({"username":localStorage["username"],"password":localStorage["password"], "bid":bid});

	$.ajax({
			url : "http://localhost:8888/bid/" + id ,
			method: 'post',
			data : data,
			contentType: "application/json",
			dataType: "json",
			success : function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				alert("Bid accepted.");				
				loadProductPage(id);
			},
			error: function(data, textStatus, jqXHR){
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
			content.append("<img src='" + product.pphoto + "' style='float: left; clear: left; padding:10px 20px 0px 0px' width='65' height='65' border='0px' />");
			content.append("<div style='text-align: left;'>" + product.pname + "</div>");
			content.append("<div id='item-seller' style='text-align: left;'>Seller: <a id='gotoSeller' >" + product.username + "</a></div>");
			content.append("<div id='item-bid' data-mini='true' style='text-align: left;'>Starting bid: " + product.pbidprice + "</div></div>"); 
			content.append("<div data-type='vertical' style='float: right; margin-right: -14px; margin-top: -80px;'>" 
				+ "<a data-role='button' href='#checkout' data-theme='e' data-icon='arrow-r' data-mini='true' data-iconpos='right' onclick='addToCart(" + product.pid + ")'>Buy now</a>"
				+ "<a data-role='button' href='#qtypopup' data-theme='b' data-icon='plus' data-mini='true' data-iconpos='right' data-rel='popup' data-position-to='window' data-transition='pop'>Add to cart</a>" 
				+ "<a data-role='button' href='#bidpopup' data-theme='c' data-icon='arrow-r' data-mini='true' data-iconpos='right' data-rel='popup' data-position-to='window' data-transition='pop'>Place bid</a></div>");
			var bidpopup = $("#my-bid");
			bidpopup.empty();
			bidpopup.append("<input type='number' id='offerbid' name='offerbid' data-mini='true' placeholder=' " + product.pbidprice + "'/>");
			bidpopup.append("<a onclick='placebid(" + product.pid + ")' data-role='button' data-rel='back' data-theme='b'  data-inline='true' data-mini='true'>Place bid</a>");
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

//loads seller page
//TODO
function loadSellerPage(sellername){
	alert(sellername + "'s Page.");
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
					list.append("<li><img src='" + sale.sphoto + "'/> <h2>" + sale.sname + "</h2> Seller: "+ sale.seller +  
					", Buyer: " + sale.buyer + ", Quantity: " + sale.squantity + ", Revenue: " + sale.srevenue + "</li>");
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
				list.append("<li><img src='" + sale.sphoto + "'/> <h2>" + sale.sname + "</h2> Seller: "+ sale.seller +  
					", Buyer: " + sale.buyer + ", Quantity: " + sale.squantity + ", Revenue: " + sale.srevenue + "</li>");
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
					+ "<p> Brand: " + product.pbrand + "</p>"
					+ "<p>Instant Price: " + product.pinstantprice + ", Bid Price: " + product.pbidprice
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

//convert the form data to json format
function ConverToJSON(formData){
	var result = {};
	$.each(formData, 
		function(i, o){
			result[o.name] = o.value;
	});
	return result;
};
