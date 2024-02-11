class ConnectionController < ApplicationController
    #skip authenticity token verification
    skip_before_action :verify_authenticity_token
    #Authenticate rquest for all actions except :index
    before_action :authenticate_request!, except: [:index]

    #create a new connection
    def create
        #build a new connection for the current user
        connection = current_user.connections.new(connection_params)
        
        #handle when connection is a success vs a failure
        if connection.save
            render json: { status: 'Connection created successfully', connection: connection }, status: :created
        else
            render json: { errors: connection.errors.full_messages }, status: :unprocessable_entity
        end
    end

    #update a connection 
    def update
        #Find the connection based on the request
        connection = Connection.find_by(id: params[:id])

        #update the connection with provided params (success vs failure)
        if connection.update(connection_params)
            render json: { status: 'Connection updated successfully', connection: connection }, status: :ok
        else
            render json: { errors: connection.errors.full_messages }, status: :unprocessable_entity
        end
    end

    #get a list of all connectiosn 
    def index
        connections = Connection.all
        render json: connections.as_json(include: { user: { only: :username } })
    end

    #Retrieve connections for the current user 
    def user_connections
        #Get all connections for the current user
        connections = current_user.connections
        render json: connections.as_json
    end

    #Delete a connection
    def destroy
        #Find the connection to be deleted for the current user
        connection = current_user.connections.find_by(id: params[:id])

        #if connection found, destroy it 
        if connection
            if connection.destroy
                render json: { status: 'Connection deleted successfully' }, status: :ok
            else
                render json: { errors: connection.errors.full_messages }, status: :unprocessable_entity
            end
        else
            render json: { error: 'Connection not found' }, status: :not_found
        end
    end
    private

    #define permitted parameters for creating/updating connections
    def connection_params
        params.require(:connection).permit(:battle_id)
    end
end
