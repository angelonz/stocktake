var page = require('webpage').create();
var jQueryCdn = 'http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
var url = 'http://babeljs.io/';
var clipperz = 'https://clipperz.is/app/';

page.open(clipperz, function(status) {
  
  if (status === 'success') {
  	console.log('success');
  	page.includeJs(jQueryCdn, function () {
  		
  		var obj = page.evaluate(function () {
			var form = $('div#loginPage form'); 
			form.find('input[name="name"]').val('angelonz');
			form.find('input[name="passphrase"]').val('st0ckt@k3');
			form.find('button[type="submit"]').click();
  			
			  
  		});

  		console.log(obj.name);

		phantom.exit();

  	});
  }
  
  
});