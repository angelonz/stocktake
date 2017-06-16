var config = {
	login: {
		url: 'https://www.dreamstime.com/',
		username: 'input#inp_user',
		password: 'input#inp_pass',
		form: 'form#loginfrm',
		submit: 'form#loginfrm input[type="submit"]',
        loginToggle: 'a.signinlbl'
	},
	balance: 'div.dt-logout-popup a[href="https://www.dreamstime.com/earnings"]',
	blacklist: [
    	'www.google-analytics.com',
        'www.googleadservices.com',
        'https://googleads.g.doubleclick.net',
        'https://staticxx.facebook.com',
		'www.facebook.com',
		'https://platform.twitter.com'
	]
	
};

module.exports = config;