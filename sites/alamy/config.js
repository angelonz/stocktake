var config = {
	login: {
		url: 'https://secure.alamy.com/logon.aspx?returnurl=https%3A%2F%2Fsecure%2Ealamy%2Ecom%2Fmyalamy%2Easpx',
		username: 'input#txtEmail',
		password: 'input#txtPassword',
		form: 'form#form1',
		submit: 'input#btnLogin'
	},
	landingPage: 'https://secure.alamy.com/myalamy-aim.aspx',
	balance: 'div#graph3 span.text-size18.blockfix.ellipsis',	
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
		'https://4645712.fls.doubleclick.net',
		'https://bid.g.doubleclick.net'
	]
	
	
};

module.exports = config;