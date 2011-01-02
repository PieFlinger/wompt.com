var wompt = require("./includes"),
    db = wompt.db;

wompt.mongoose.model('User',{

	collection : 'users',

	properties: [
		//simple attributes
		 'name'
		,'email'
		,'password'
		,'one_time_token'
		
		// embedded documents
		,{
		'sessions': [
			['token', 'last_ip', 'session_id', 'last_used']
		]
		,'authentications': [
			['provider','uid']
		]
		}
	],
	
	indexes : [
		 'email'
		,'sessions.token',
		,'authentications'
	],
	
	methods: {
		wrap: function(){
			return new wompt.MetaUser(this);
		},
		
		signed_up: function(){
			return !!this.email || !!this.name;
		}
	}
});

module.exports = db.model('User');

