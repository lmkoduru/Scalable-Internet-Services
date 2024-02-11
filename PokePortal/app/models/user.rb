class User < ApplicationRecord
  validates :username, presence: true, uniqueness: {case_sensitive: false}
  has_secure_password

  has_many :posts, dependent: :destroy
  has_many :comments
  has_many :connections
  has_many :battles, dependent: :destroy
end
