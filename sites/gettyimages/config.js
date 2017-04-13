var config = {
	login: {
		url: 'https://esp.gettyimages.com/sign-in?returnUrl=/acm/Reports/Statement',
		username: 'input#new_session_username',
		password: 'input#new_session_password',
		form: 'form#new_new_session',
		submit: 'button#sign_in'
	},
    link1: 'a[href="/ui/account_manager"]',
	balance: 'span#earnings-net-tot',
	blacklist: [
    	'www.google-analytics.com',
        'www.googleadservices.com',
        'https://googleads.g.doubleclick.net'        
	]	
};

module.exports = config;