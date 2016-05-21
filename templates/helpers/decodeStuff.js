var Handlebars = require('handlebars');

Handlebars.registerHelper('decodeStuff', function (anything, option) {
	option = Handlebars.escapeExpression(option);
	if(anything == 'undefined'){
		return "";
	}else if(option == 'yes'){
		anything = decodeURIComponent(anything);
		temp = anything.replace(',', '\n');
		return temp;
	}else{
		return decodeURIComponent(anything);
	}
});