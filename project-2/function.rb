# frozen_string_literal: true

require 'json'
require 'jwt'
require 'pp'

def main(event:, context:)
  # You shouldn't need to use context, but its fields are explained here:
  # https://docs.aws.amazon.com/lambda/latest/dg/ruby-context.html
  
  #extracting the keys from headers
  my_headers = event["headers"].keys
  #loop through the header keys
  for header in my_headers
    #make sure current header key doesn't have capital letters
    if header.casecmp?("content-type")
      event["headers"]["content-type"] = event["headers"][header]
    end

    #make sure the current header key doesn't have capital letters
    if header.casecmp?("authorization")
      event["headers"]["authorization"] = event["headers"][header]
    end
  end

  #check that we have a GET request 
  if event["httpMethod"] == "GET"
    begin
      #check if the path is "/token", then respond 405
      if event["path"] == "/token"
        return response(body: nil, status: 405)
      end

      #check if the path is not "/", then respond 404
      if event["path"] != "/"
        return response(body: nil, status: 404)
      end

      #check if a proper Authorization: Bearer <TOKEN> header is provided 
      if event["headers"]["authorization"].split(" ")[0] != "Bearer"
        #if proper header not provided, responds 403 
        return response(body: nil, status: 403)
      end

      #decode the JWT token
      my_payload = JWT.decode(event["headers"]["authorization"].split(" ")[1], "ITSASECRET")

    #If the JWT signature is not valid or is expired, respond 401 
    rescue JWT::ImmatureSignature, JWT::ExpiredSignature => e
      return response(body: nil, status: 401)

    #if an issue decoding JWT, respond 403
    rescue JWT::DecodeError => e
      return response(body: nil, status: 403)
      
    #catch any other exceptions that might occur, respond 403 
    rescue 
      return response(body: nil, status: 403)

    #if no exceptions (success), respond 200 
    else 
      return response(body: my_payload[0]["data"], status: 200)
    end

  #check that we have a POST request
  elsif event["httpMethod"] == "POST"
    begin
      #check if the path is "/", then respond 405
      if event["path"] == "/"
        return response(body: event, status: 405)
      end
  
      #check if the request isn't application/json, respond 415
      if event["headers"]["content-type"] != "application/json"
        return response(body: event, status: 415)
      end

      #parse the JSON document 
      JSON.parse(event["body"])

    #ckeck if the body is not json, respond 422
    rescue 
      return response(body: event, status: 422)
    
    else
      #create a payload with required data, exp, nbf specifications
      my_payload = {
        data: JSON.parse(event["body"]), 
        exp: Time.now.to_i + 5,
        nbf: Time.now.to_i + 2
      }
      
      #encode the JWT token
      my_token = JWT.encode my_payload, "ITSASECRET", "HS256"
     
      #on success, respond 201
      return response(body:{"token" => my_token}, status: 201)
    end

  #if conditions not met, respond 405 
  else
    return response(body: nil, status: 405)
  end
end

def response(body: nil, status: 200)
  {
    body: body ? body.to_json + "\n" : '',
    statusCode: status
  }
end

if $PROGRAM_NAME == __FILE__
  # If you run this file directly via `ruby function.rb` the following code
  # will execute. You can use the code below to help you test your functions
  # without needing to deploy first.
  ENV['JWT_SECRET'] = 'NOTASECRET'

  # Call /token
  PP.pp main(context: {}, event: {
               'body' => '{}',
               'headers' => { 'Content-Type' => 'application/json' },
               'httpMethod' => 'POST',
               'path' => '/token'
             })

  # Generate a token
  PP.pp "GET" 
  payload = {
    data: { user_id: 128 },
    exp: Time.now.to_i + 1,
    nbf: Time.now.to_i
  }
  token = JWT.encode payload, ENV['JWT_SECRET'], 'HS256'
  # Call /
  PP.pp main(context: {}, event: {
               'headers' => { 'Authorization' => "hi #{token}",
                              'Content-Type' => 'application/json' },
               'httpMethod' => 'GET',
               'path' => '/'
             })
end