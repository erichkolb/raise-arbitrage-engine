function toTitleCase(str)
{
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