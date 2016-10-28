var path = require('path');
var request = require('request')
var cheerio = require('cheerio');
var fs = require('fs');

exports.main = function(req, res) {
	res.sendFile(path.join(__dirname, '../public/views/index.html'));
}

exports.vendor = function(req, res) {
	var merchant = req.params.vendor;

	var wikiUrl = getUrl(merchant)
	var raiseUrl = "https://seller-api.raise.com/v2/brands/" + getUUID(merchant) + "/price-recommendation?value=100"

	request({
		url: raiseUrl,
		json: true
	}, function (error, response, data) {
		if (!error && response.statusCode === 200) {
			prices = data.data.attributes
			raiseDiscount = 1 - prices.recommended_price/prices.value
			//console.log("Data for", merchant);
			//console.log("Raise Discount:", raiseDiscount);
			var profit = 0
			var cardsNumber = 0
			var cost = 0
			var raise = false
			request({
				url: wikiUrl,
				json: true
			}, function (error, response, data) {
				if (!error && response.statusCode === 200) {
					if (!data) {
						res.send("null")
					}
					else if (data[0].discount <= raiseDiscount) {
						res.send("none")
					}
					else {
						var profitList = new Object();
						var cardNumberList = new Object();
						var costList = new Object();
						var roiList = new Object();
						for (var i = 0; i < data.length; i++) {
							card = data[i]
							if (card.seller.localeCompare('Raise') == 0 && !raise) {
								continue
							}
							if (card.discount > raiseDiscount) {
								var thisProfit = (card.value * (1 - raiseDiscount) - card.price) * card.quantity;
								profit += thisProfit;
								cardsNumber += card.quantity
								cost += card.price * card.quantity
								if (profitList[card.seller] == null) {
		                           cardNumberList[card.seller] = card.quantity
		                           profitList[card.seller] = thisProfit
		                           costList[card.seller] = card.price * card.quantity
								} 
								else {
		                           cardNumberList[card.seller] += card.quantity
		                           profitList[card.seller] += thisProfit
		                           costList[card.seller] += card.price * card.quantity
								}
							}
						}
						for (var i in profitList) {
							roiList[i] = profitList[i]/costList[i]*100;
						}
						var result = [];
						result.push("Arbitrage Profit");
						result.push(profit.toFixed(2));
						result.push("Cards Bought");
						result.push(cardsNumber);
						result.push("Dollars Needed");
						result.push(cost.toFixed(2));
						result.push("Return on Investment");
						result.push(profit/cost);
						for (var i in profitList) {
							result.push(i);
							result.push(profitList[i].toFixed(2));
							result.push(cardNumberList[i]);
							result.push(costList[i].toFixed(2));
							result.push(roiList[i].toFixed(4));
						}
						//var ROI = profit/cost;
						//var result = {"data":[{"Arbitrage Profit", profit}, {"Cards Bought", cardsNumber}, {"Dollars Needed", cost}, {"Return on Investment", ROI}]};
						res.send(result);
						//res.send("Arbitrage Profit: "+profit+"\nCards Bought: "+cardsNumber+"\nDollars Needed: "+cost+"\nROI: "+profit/cost+"\n");
						//console.log("Arbitrage Profit:", profit);
						//console.log("Cards Bought:", cardsNumber);
						//console.log("Dollars Needed:", cost);
						//console.log("ROI:", profit/cost);
					}
	           }

	       })
		}
	})	
}

function getUUID(vendor) {
	var obj = JSON.parse(fs.readFileSync('brands.json', 'utf8'));

	for (var i = 0; i < obj.data.length; i++) {
		if (vendor.localeCompare(obj.data[i].attributes.name == 0)) {
			return obj.data[i].id
		}
	}
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getUrl(vendor) {
	var vendorString = vendor.trim();
	vendorString = vendorString.replace(/ +/g, " ");
	vendorString = vendorString.replace(/\'/g, "");
	vendorString = toTitleCase(vendorString);
	vendorString = encodeURIComponent(vendorString);
	var url = "http://www.giftcardwiki.com/giftcards/data/" + vendorString;
	return url;
}
