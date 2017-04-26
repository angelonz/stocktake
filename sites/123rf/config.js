var config = {
	login: {
		url: 'https://www.123rf.com/login.php',
		username: 'input#panel_field_uid',
		password: 'input#panel_field_password',
		form: 'form#panel_login_form',
		submit: '',
	},
	waitForElement: 'div#dsp_user_menu',
	landingPage: 'https://www.123rf.com/contributor/index.php',
	balance: 'div#showUnclaimed',	
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