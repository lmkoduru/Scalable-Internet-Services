class CreateBattles < ActiveRecord::Migration[7.1]
  def change
    create_table :battles do |t|
      t.string :title
      t.text :body
      t.date :date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
