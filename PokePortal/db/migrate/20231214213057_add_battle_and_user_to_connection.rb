class AddBattleAndUserToConnection < ActiveRecord::Migration[7.1]
  def change
    add_reference :connections, :battle, null: false, foreign_key: true
    add_reference :connections, :user, null: false, foreign_key: true
  end
end
