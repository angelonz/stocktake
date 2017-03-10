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
			
  			return {
				  name: form.find('input[name="name"]').attr('placeholder')
				 //pass: $(form).find('input[name="passphrase"]')
			};
			  
  		});

  		console.log(obj.name);

		phantom.exit();

  	});
  }
  
  
});