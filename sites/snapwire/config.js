var config = {
	login: {
		url: 'https://www.snapwi.re/account/payouts',
		username: 'input#email',
		password: 'input#password',
		form: 'form',
		submit: ''
	},
	balance: 'div#balance-notification div.text-right h3',
	blacklist: [
    	'https://maps.googleapis.com',
        'https://platform.twitter.com',
        'https://www.google.tagmanager.com',
        'https://static.ads-twitter.com',
        'www.google-analytics.com',
        'www.googleadservices.com',
        'https://googleads.g.doubleclick.net',
        'csi.gstatic.com',
        'stats.g.doubleclick.net',
        'www.google.com',
        'www.facebook.com'   
	]	
};

module.exports = config;