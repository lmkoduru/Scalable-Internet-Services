class User < ApplicationRecord
    has_many :posts, dependent: :destroy

    validates :username, presence: true
    validates :email, presence: true
end
