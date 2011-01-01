var utils = require('connect/utils');

function Expirer(collection, options){
	var defaults = {
	    expire_after_ms: 10 * 60 * 1000,
			time_attribute: 'touched'
		},
		timer;
		
	options = utils.merge(defaults, options || {});
	options.cleanup_interval = options.check_interval || options.expire_ms;
	
	function check_expiration(){
		var i = 0,
		    expire_time = new Date() - options.expire_after_ms,
				time_attr = options.time_attribute;
		
		for(var k in collection){
			if(collection[k][time_attr] < expire_time){
				delete collection[k]
			}
		}
	}
	
	this.pause = function(){
		if(timer) clearInterval(timer);
	}
	
	this.start = function(){
		if(!timer) timer = setInterval(check_expiration, options.check_interval);	
	}

	this.start();
}



module.exports = Expirer;