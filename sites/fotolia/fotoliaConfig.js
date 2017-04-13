var config = {
	login: {
		url: 'https://www.fotolia.com/Member/Login',
		username: 'input#login',
		password: 'input#password',
		form: 'form.form-large',
		submit: 'form.form-large #signin_submit',
		modal: 'a.ftl-modal-close'		
	},
	balance: '#ftl-header-member-nb-credits',
	blacklist: [
	    'fls.doubleclick.net',
    	'ssl.google-analytics.com',
    	'bid.g.doubleclick.net'
	]
	
};

module.exports = config;