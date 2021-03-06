var wompt = require("./includes");

function MetaUser(doc){
	var me = this;
	this.clients = new wompt.ClientPool();
	this.doc = doc;
	this.visible = true;
	this.readonly = !doc;
	this.touch();
/*
 	No sense in using this memory untill we are actually doing something with these
 	messages on the client side
 	TODO: do somehting with these messages on the client side
	this.clients.on('added', function(client){
		if(client.meta_data && client.meta_data.channel){
			me.clients.broadcast({
				action: 'new_client',
				channel: client.meta_data.channel.name
			},client);
		}
	});
*/
};

MetaUser.prototype = {
	id: function(){
		return this.doc ? this.doc._id.toJSON() : null;
	},
	
	touch: function(){
		this.touched = new Date();
	},
	
	authenticated: function(){
		return !!this.doc;
	},
	
	authentication_for: function(provider){
		return this.doc && this.doc.authenticationFor(provider);
	},
	
	new_session: function(session){
		this.clients.broadcast({
			action: 'new_session'		
		});
	},
	
	profile_url: function(){
		return "/users/" + this.id();
	},
	
	same_user: function(u){
		if(u.id == MetaUser.prototype.id) // Check if this is a MetaUser
			return u == this || (this.authenticated() && u.id() == this.id());
		else
			return this.doc && this.doc.same_user(u);
	},
	
	end_session: function(session){
		this.clients.broadcast({
			action: 'end_session'
		});
		this.clients.each(function(client, index){
			if(client.meta_data && client.meta_data.token == session.token)
				client._onDisconnect();
		});
	}
}


module.exports = MetaUser
