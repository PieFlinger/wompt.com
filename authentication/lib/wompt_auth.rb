require 'sinatra/base'
require 'openid/store/filesystem'
require 'lib/models/user'

Mongomatic.db = Mongo::Connection.new.db(CONFIG[:database])

ONE_TIME_TOKEN_COOKIE = 'wompt_auth_one_time_token'

class OmniAuth::Strategies::OAuth2
  def full_host
    uri = URI.parse(request.url.gsub('|','%7C'))
    uri.path = ''
    uri.query = nil
    uri.to_s
  end
end

class WomptAuth < Sinatra::Base
  use Rack::Session::Pool,
    :path => '/auth',
    :expire_after => 60, # In seconds
    :secret => 'C6xyESB0FdkabrhtBxOlPikZTS0jKnQRq1vMfluX'
  
  use OmniAuth::Builder do
    #provider :facebook , '181725458505189' , '5afa28d747aabd3d1a6ce71d26933c14', :scope => 'email'
    provider :open_id, nil, :name => 'google', :identifier => 'https://www.google.com/accounts/o8/id', :scope => 'email'
  end

  post '/auth/:name/callback' do |name|
    auth = request.env['omniauth.auth']
    host = request.env['HTTP_HOST'].match(/^([^:]+)(?:\:\d+)$/)[1]
    user = find_or_create_user(auth)
    response.set_cookie(ONE_TIME_TOKEN_COOKIE, :value => user['one_time_token'], :path => '/')
    haml :redirect, :locals => {:to => "/"}
  end
  
  def find_or_create_user auth
    info = auth['user_info']
    if user = User.find_one('authentications' => {'provider' => auth['provider'], 'uid' => auth['uid']})
      puts "Found User by auth"
      return user
    elsif (email = info['email']) && (user = User.find_one('email' => email))
      puts "Found User by email"
      user.add_authentication('provider' => auth['provider'], 'uid' => auth['uid'])
    else
      puts "Creating User"
      user = User.new('authentications' => [{'provider' => auth['provider'], 'uid' => auth['uid']}])
      user['email'] = info['email'] if info['email']
      user['name'] = info['name'] if info['name']
    end
    
    user['one_time_token'] = generate_token
    user.save!
    return user
  end
  
  def generate_token
    ActiveSupport::SecureRandom.base64(16)
  end
end
