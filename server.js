var request = require('request')
var cheerio = require('cheerio');
var fs = require('fs');

var merchant = "Gap"

function getUUID(vendor) {
   var obj = JSON.parse(fs.readFileSync('brands.json', 'utf8'));

   for (var i = 0; i < obj.data.length; i++) {
       if (vendor.localeCompare(obj.data[i].attributes.name == 0)) {
           return obj.data[i].id
       }
   }
}



var wikiUrl = "http://www.giftcardwiki.com/giftcards/data/" + merchant
var raiseUrl = "https://seller-api.raise.com/v2/brands/" + getUUID(merchant) + "/price-recommendation?value=100"

request({
   url: raiseUrl,
   json: true
}, function (error, response, data) {
   if (!error && response.statusCode === 200) {
       prices = data.data.attributes
       raiseDiscount = 1 - prices.recommended_price/prices.value
       console.log("Data for", merchant);
       console.log("Raise Discount:", raiseDiscount);
       var profit = 0
       var cardsNumber = 0
       var cost = 0
       request({
           url: wikiUrl,
           json: true
       }, function (error, response, data) {
           if (!error && response.statusCode === 200) {
               for (var i = 0; i < data.length; i++) {
                   card = data[i]
                   if (card.discount > raiseDiscount) {
                       profit += (card.value * (1 - raiseDiscount) - card.price) * card.quantity
                       cardsNumber += card.quantity
                       cost += card.price * card.quantity
                   }
               }
               console.log("Arbitrage Profit:", profit);
               console.log("Cards Bought:", cardsNumber);
               console.log("Dollars Needed:", cost);
               console.log("ROI:", profit/cost);
           }

       })
   }
})