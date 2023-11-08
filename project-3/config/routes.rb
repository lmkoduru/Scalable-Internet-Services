Rails.application.routes.draw do
  root "users#index"
  resources :users do
    resources :posts
  end

  # only:[] means do not generate CRUD routes
  resources :posts, only: [] do
    resources :comments
  end
  
  get "up" => "rails/health#show", as: :rails_health_check
end
