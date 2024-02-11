class AddBioAndProfilePicToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :bio, :text
    add_column :users, :profile_pic, :text
  end
end
