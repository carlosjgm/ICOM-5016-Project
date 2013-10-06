//load the complete product list to the browse page
$(document).on('pagebeforeshow', "#browse", function( event, ui ) {
	browseCategories('all');
});

//load today's sales list
$(document).on('pagebeforeshow', "#sales", function( event, ui ) {
	salesCategories('all');
});

//show info button: if logged in, shows username and on click goes to profile page; if not logged in, on click goes to login page
function profilebutton(buttonid,pagepanel){
	var user = localStorage.getItem("username");
	if(user != null)
			$(buttonid).replaceWith("<a id='" + buttonid + "' href='" + pagepanel + "' data-role='button' data-icon='bars' data-mini='true'"
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
			$.mobile.loading("hide");
			$.mobile.changePage("#browse", {reloadPage : true});
		},
		error: function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$("#invalid").replaceWith("<br /><p id='invalid' style='color:red'>"+data.responseText+"</p>");
			alert(data.responseText);
		}
	});
	
};

//authorizes user
//add credentials to any request and form data
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
			localStorage.setItem("username", document.getElementById("newusername").value);
			localStorage.setItem("password", document.getElementById("newpassword").value);
			$.mobile.loading("hide");
			$.mobile.changePage("#browse", {reloadPage : true});
		},
		error : function(data,textStatus,jqXHR){
			$("#register-invalid").replaceWith("<br /><p id='invalid' style='color:red'>"+data.responseText+"</p>");
			$.mobile.loading("hide");
			alert(data.responseText);			
		}
	});
};

//updates card information
//submits card-form
//goes to #profile if successful
//TODO
function  updCard(){
	$.mobile.changePage("#browse", {reloadPage : true});
};

//buy item id (add to shopping cart)
//goes to #cart
//TODO
function buy(id){
	
};

//bid on item id
function placebid(id){
	alert("Item ID: "+id +", Bid: $" + document.getElementById("my-bid").value);
	var bid = document.getElementById("my-bid").value;
	var data = JSON.stringify({"bid":bid, "id":id});
	$.ajax({
			url : "http://localhost:8888/bid/" + id ,
			method: 'post',
			data : data,
			contentType: "application/json",
			dataType: "json",
			success : function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				loadProductPage(id);
			},
			error: function(data, textStatus, jqXHR){
				$.mobile.loading("hide");
				alert(data.responseText);
			}
		});	
};

//loads product page
//TODO
function loadProductPage(id){
	
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
					list.append("<li><img src='" + sale.img + "'/> <h2>" + sale.name + "</h2> Seller: "+ sale.seller +  
						", Buyer: " + sale.buyer + ", Revenue: $" + sale.revenue + "</li>");
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
				list.append("<li><img src='" + sale.img + "'/> <h2>" + sale.name + "</h2> Seller: "+ sale.seller +  
					", Buyer: " + sale.buyer + ", Revenue: $" + sale.revenue + "</li>");
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

//replaces #product-list with a list of products from category
//stores category in localvariable
function browseCategories(category){
	$.mobile.loading("show");
	//localStorage.setItem("browseCategory", category);
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
				list.append("<li><a href='#product'><img src='" + product.photo + "' />"
					+ "<h3>" + product.name + "</h3>"
					+ "<p> Brand: " + product.brand + "</p>"
					+ "<p>Instant Price: $" + product.instantprice + ", Bid Price: $" + product.nextbidprice
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
