var wompt = require("../includes"),
mongoose = wompt.mongoose,
ObjectId = mongoose.Schema.ObjectId;

var Account = new mongoose.Schema({
	'display_name'    : String
	,'name'           : String
	,'owner_ids'      : [ObjectId]
	,'secret'         : {type: String, 'default': generateSecret}
	,'features'       : {}
});

// number defines index sort order (1=asc)
Account.index({name: 1});

Account.method({
	findStats: function findStats(){
		var opts = arguments[0];
		opts.account_id = this._id;
		return wompt.models.AccountStats
			.find.apply(wompt.models.AccountStats, arguments)
			.sort('t', -1);
	},
	
	hasFeature: function hasFeature(featureName){
		return this.features && this.features[featureName];
	}
})

Account.static({
	generateSecret: generateSecret
});

// Model name, Schema, collection name
mongoose.model('Account', Account, 'accounts');
module.exports = mongoose.model('Account');

function generateSecret(){
	return wompt.util.randomString(20);
}
