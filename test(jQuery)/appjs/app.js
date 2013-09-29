var thingList = new Array(
	//function Thing(id, name, instantPrice, bidPrice, description, model, image, brand, dimensions){]
	new Thing("1", "Awesome Toothbrush", "$4.00", "$0.99", "A cool toothbrush I don't use anymore", "XF-5000", "", "Colgate", "0.5'x7'x0.5'"),
	new Thing("2", "Some Crappy Cologne", "$6.00", "$0.99", "I got this for my birthday, but I don't really like how it smells", "My Little Pony for Him", "", "Avon", "2'x4'x3'"),
	new Thing("3", "5 Slices of Bread", "$1.00", "$0.99", "I bought these at Walgreens but I'm leaving for New Zealand in two days and I don't want to throw them out", "Integral", "", "Pan Pepin", "6'x6'x12'"),
	new Thing("4", "Broken Heart Pinata", "$7.00", "$0.99", "A nice heart-shaped pinata that we used for some party. It got hit several times so it's now broken but if you have glue at home you can fix it and it'll be like new", "XF-5000", "", "Pinatas R Us", "24'x12'x36'"),
	new Thing("5", "Muddy Shoes", "$2.00", "$0.99", "A pair of sneakers I wore when hiking at some exotic rainforest in Puerto Rico. They got all muddy and I'm too lazy to clean them so I want to sell them, but they are cool shoes when they are clean", "GPS", "", "Converse", "'x7'x0.5'")	
);

$(document).on('pagebeforeshow', "#home", function( event, ui ) {
	var len = thingList.length;
	var list = $("#things-list");
	list.empty();
	var thing;
	for (var i=0; i < len; ++i){
		thing = thingList[i];
		list.append("<li><a href=\"#\">" + 
			"<h2>" + thing.name + " " + "</h2>" +
			"<p><strong> Model: " + thing.model + "</strong></p>" +
			"<p><strong> Brand: " + thing.brand + "</strong></p>" + 
			"<p>" + thing.description + "</p>" +
			"<p class=\"ui-li-aside\">" + thing.instantPrice + "</p>" +
			"</a></li>");
	}
	list.listview("refresh");
});