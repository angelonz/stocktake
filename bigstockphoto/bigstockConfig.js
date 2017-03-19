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
    	'www.facebook.com'

	]
	
};

module.exports = config;