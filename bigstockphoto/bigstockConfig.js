var config = {
	login: {
		url: 'https://www.bigstockphoto.com/login/',
		username: 'input#uname',
		password: 'input#passwd',
		form: 'form[action="https://www.bigstockphoto.com/login"]',
		submit: '',
	},
	balance: 'li.dropdown.account > a > span',	
	blacklist: [
	    'analytics.twitter.com',
    	'ssl.google-analytics.com',
    	'www.google-analytics.com',
    	'https://insight.adsrvr.org',
		'www.google.com',
		'https://www.gstatic.com',
		'https://stats.g.doubleclick.net',
		'https://assets.customer.io'
	]
	
	
};

module.exports = config;