var page = require('webpage').create();
var jQueryCdn = 'https://code.jquery.com/jquery-3.1.1.slim.min.js';
page.open('https://clipperz.is/app/', function(status) {
  
  if (status === 'success') {
  	
  	page.includeJs(jQueryCdn, function () {
  		
  		var subheading = page.evaluate(function () {
  			
  			return $('div.headerContent h5').text();
  		});

  		console.log(subheading);

		phantom.exit();

  	});
  }
  
  
});