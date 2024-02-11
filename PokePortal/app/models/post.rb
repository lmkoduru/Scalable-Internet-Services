class Post < ApplicationRecord
  belongs_to :user
  belongs_to :forum
  has_many :comments, dependent: :destroy

  validates :title, presence: true
  validates :body, presence: true, length: { minimum: 10 }
end
