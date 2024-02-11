class Battle < ApplicationRecord
  belongs_to :user
  has_many :connections
end
