require 'jwt'
require 'json'

class UserController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def new
    @user = User.new
  end

  def generate_jwt(id)
    jwt_secret = 'NOTASECRET' # TODO change later
    day = 24.hours / 1.minute
    payload = {
      data: { id: id },
      exp: Time.now.to_i + day,
      nbf: Time.now.to_i,
    }
    token = JWT.encode payload, jwt_secret, 'HS256'
    token
  end

  def decode_jwt(token)
    jwt_secret = 'NOTASECRET'
    begin
      # Decode the token with your secret
      decoded_token = JWT.decode token, jwt_secret, true, { algorithm: 'HS256' }

      # The first index of the decoded array contains the payload
      payload = decoded_token[0]

      # You can now access the payload data, for example:
      user_id = payload['data']['id']
      return user_id
    rescue JWT::DecodeError => e
      puts "Decode error: #{e.message}"
      nil
    rescue JWT::ExpiredSignature
      puts "Token has expired"
      nil
    rescue JWT::ImmatureSignature
      puts "Token is not yet valid"
      nil
    end
  end

  def login
    user = User.find_by(username: user_params[:username])

    if user&.authenticate(user_params[:password])
      token = generate_jwt(user.id)
      render json: {status: "User login successful", user: user, token: token}, status: :ok 
    else
      render json: {errors: user.errors.full_messages}, status: :not_found
    end
  end

  def create
    @user = User.new(user_params)

    if @user.save
      render json: {status: "User created successfully", user: @user}, status: :created
    else
      render json: {errors: @user.errors.full_messages}, status: :conflict
    end
  end

  def update
    user = find_user(request)

    if user.update(user_params)
      render json: { status: "User updated successfully", user: user }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def get_info
    user = find_user(request)

    if user
      render json: {status: "User found successfully", user: user}, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def find_user(request)
    authorization_token = request.headers['Authorization'].split(' ').last
    id = decode_jwt(authorization_token)

    return User.find_by(id: id)
  end

 def destroy
    authorization_token = request.headers['Authorization'].split(' ').last
    id = decode_jwt(authorization_token)
    
    # Assuming `decode_jwt` method returns the user's ID after decoding the token
    user = User.find_by(id: id)

    if user
      # This will destroy the user and all associated posts if the user `has_many :posts` and `dependent: :destroy` is set in the User model.
      user.destroy
      render json: { message: 'User and associated posts successfully destroyed.' }, status: :ok
    else
      render json: { error: 'User not found.' }, status: :not_found
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :password, :bio, :profile_pic)
  end

end
