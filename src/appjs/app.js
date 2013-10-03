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
		$(buttonid).replaceWith("<a id='" + buttonid + "' href='#account-panel' data-role='button' data-icon='bars' data-mini='true'"
			+ "data-inline='true'>" + user + "</a>");	
	else
		$(buttonid).replaceWith("<a id='" + buttonid + "' href='#login' data-role='button' data-icon='check' data-iconpos='right' data-mini='true' data-inline='true'>Login</a>");
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
			localStorage.setItem("username", document.getElementById("username").value);
			localStorage.setItem("password", document.getElementById("password").value);
			alert("Login Successful!");
			$.mobile.loading("hide");
			$.mobile.changePage("#browse", {reloadPage : true});
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			if (data.status == 404){
				$("#invalid").replaceWith("<br /><p id='invalid' style='color:red'>Invalid username/password. Please try again.</p>");
				alert("Invalid username/password. Please try again.");
			}
			else if(data.status == 400){
				$("#invalid").replaceWith("<br /><p id='invalid' style='color:red'>The form has missing fields.</p>");
				alert("The form has missing fields.");
			}
			else {
				$("#invalid").replaceWith("<br /><p id='invalid' style='color:red'>Internal Error. Please try again.</p>");
				alert("Internal Error.");		
			}
		}
	});
	
};

//authorizes user
function authorize(){
	
};

//logout from account
//goes to browse page
function logout(){
	localStorage.removeItem("username");
	localStorage.removeItem("password");
	$.mobile.changePage("#browse", {reloadPage : true, transition : "none"});
};

//register new user and save username/password in local storage if successful
//submits registration-form
//goes to #cCard if successful
function register(){
	$.mobile.changePage("#cCard");
};

//updates card information
//submits card-form
//goes to #profile if successful
function  updCard(){
	$.mobile.changePage("#browse", {reloadPage : true});
};

//buy item id (add to shopping cart)
//goes to #cart
function buy(id){
	
};

//bid on item id
//goes to #bidding
function bid(id){
	
};

//convert the form data to json format
function ConverToJSON(formData){
	var result = {};
	$.each(formData, 
		function(i, o){
			result[o.name] = o.value;
	});
	return result;
}
