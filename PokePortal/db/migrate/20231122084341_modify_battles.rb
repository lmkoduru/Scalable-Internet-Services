class ModifyBattles < ActiveRecord::Migration[7.1]
  def change
    change_table :battles do |t|
      t.change :title, :text
      t.rename :body, :description
      t.string :battle_type
    end
  end
end
