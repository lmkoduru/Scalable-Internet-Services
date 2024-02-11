class ApplicationController < ActionController::Base

  helper_method :current_user
  
  protected

  def authenticate_request!
    @current_user = find_user_from_token
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  end

  def current_user
    @current_user
  end

  private

  def find_user_from_token
    token = request.headers['Authorization'].to_s.split(' ').last
    user_id = decode_jwt(token)
    puts user_id
    User.find_by(id: user_id) if user_id
  end

  def decode_jwt(token)
    jwt_secret = 'NOTASECRET' # TODO: Use Rails secrets or environment variable
    begin
      decoded_token = JWT.decode token, jwt_secret, true, { algorithm: 'HS256' }
      decoded_token[0]['data']['id']
    rescue JWT::DecodeError, JWT::ExpiredSignature, JWT::ImmatureSignature => e
      puts "Token error: #{e.message}"
      nil
    end
  end
end
