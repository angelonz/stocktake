var config = {
	login: {
		url: 'http://alamy.com',
		username: 'input#txtEmail',
		password: 'input#txtPassword',
		form: 'form#form1',
		submit: '',
		link: 'li#log-in'
	},
	waitForElement: 'li#my-alamy',
	landingPage: 'https://secure.alamy.com/myalamy-aim.aspx',
	balance: 'div.your-sales div#graph3 span.textsize18',	
	blacklist: [
	    'analytics.twitter.com',
    	'ssl.google-analytics.com',
    	'www.google-analytics.com',
    	'https://insight.adsrvr.org',
		'www.google.com',
		'https://www.gstatic.com',
		'https://ssl.gstatic.com',
		'https://stats.g.doubleclick.net',
		'https://assets.customer.io',
		'https://googleads.g.doubleclick.net',
		'https://4645712.fls.doubleclick.net'
	]
	
	
};

module.exports = config;