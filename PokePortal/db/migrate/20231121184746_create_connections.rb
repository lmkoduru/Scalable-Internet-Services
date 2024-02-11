class CreateConnections < ActiveRecord::Migration[7.1]
  def change
    create_table :connections do |t|
      t.integer :type

      t.timestamps
    end
  end
end
