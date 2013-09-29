$(document).on('pagebeforeshow', "#browse", function( event, ui ) {
	$.ajax({
		url : "http://localhost:8888/browse",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var len = productList.length;
			var list = $("#product-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><h2>" + product.name + "</h2><p><strong> Brand: " + product.brand + "</strong></p>" + 
					"<p>" + product.description + "</p>" +
					"<p class=\"ui-li-aside\"><button>Buy: $" + product.instantprice + "</button>" +
					"<br /><button>Bid: $" + product.nextbidprice + "</button></p>" +
					"</li>");
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

//show info button: if logged in, shows username and on click goes to profile page; if not logged in, on click goes to login page
function profilebutton(buttonid){
	var user = localStorage.getItem("username");
	if(user != null)
		$(buttonid).replaceWith("<a href='#profile/:" + user + "' data-role='button' data-icon='info' data-mini='true' data-inline='true'>" 
			+ user + "</a>");	
	else
		$(buttonid).replaceWith("<a href='#login' data-role='button' data-icon='check' data-iconpos='right' data-mini='true' data-inline='true'>Login</a>");
};

//submit login form and save username/password in local storage if successful
function login(){
	
	//submit form to http://localhost:8888/login
	//if successful, store username and password in localStorage 
	//else, replace id=invalid with user/pass invalid text
	$("#invalid").replaceWith("<br /><p style='color:red'>Invalid username/password. Please try again.</p>");
	//localStorage.setItem("username", document.getElementById("username").value);
	//localStorage.setItem("password", document.getElementById("password").value);
	
};

//buy item id (add to shopping cart)
function buy(id){
	
};
