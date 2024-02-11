class BattlesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_request!, except: [:index]

  def create
    battle = current_user.battles.new(battle_params)
    if battle.save
      render json: { status: 'Battle created successfully', battle: battle }, status: :created
    else
      render json: { errors: battle.errors.full_messages }, status: :unprocessable_entity
    end
  end

  #update the battles
  def update
    #Find the battle based on the request 
    battle = Battle.find_by(id: params[:id])

    #update the battle with the provided params (success vs failure cases) 
    if battle.update(battle_params)
      render json: { status: "Battle updated successfully", battle: battle }, status: :ok
    else
      render json: { errors: battle.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    battles_without_connections = Battle.left_outer_joins(:connections).where(connections: { id: nil })
    render json: battles_without_connections.as_json(include: {user: { only: :username}})
  end

  def connected_battles
    battles_with_connection_ids = current_user.connections.map do |connection|
      {
        battle: connection.battle,
        connection_id: connection.id
      }
    end
    render json: battles_with_connection_ids
  end

  def user_battles
    battles = current_user.battles
    render json: battles.as_json
  end

  def destroy
    battle = current_user.battles.find_by(id: params[:id])
    if battle
      if battle.destroy
        render json: { status: 'Battle deleted successfully' }, status: :ok
      else
        # If there's an error during the destroy process (e.g., due to callbacks)
        render json: { errors: battle.errors.full_messages }, status: :unprocessable_entity
      end
    else
      # If the battle with the given id is not found
      render json: { error: 'Battle not found' }, status: :not_found
    end
  end
  private

  def battle_params
    params.require(:battle).permit(:title, :description, :battle_type, :date)
    #params.permit(:title, :description, :battle_type, :date)
  end
end
