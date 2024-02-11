Rails.application.routes.draw do
  root 'homepage#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  post '/user/signup', to: 'user#create'
  post '/user/login', to: 'user#login'
  post '/user/update', to: 'user#update'
  get  '/user/info', to: 'user#get_info'
  delete '/user', to: 'user#destroy'
  # Defines the root path route ("/")
  get '/battles', to: 'battles#index'
  get '/user_battles', to: 'battles#user_battles'
  get '/connected_battles', to: 'battles#connected_battles'
  post '/battles/create', to: 'battles#create'
  post '/battles/:id', to: 'battles#update' #route for updating battles 
  delete '/battles/:id', to: 'battles#destroy'

  # posts
  get '/user_posts', to: 'post#user_posts'
  get '/posts/:tag', to: 'post#index_by_forum'
  get '/posts/:tag/:id', to: 'post#index'
  put '/posts/:id', to: 'post#update'
  post '/posts', to: 'post#create'
  delete '/posts/:id', to: 'posts#destroy'
  # root "posts#index"
  get '*path', to: 'homepage#index', constraints: ->(request) do

  # comments
  post '/comment', to: 'comment#create'
  get '/comment/:id', to: 'comment#index'

    !request.xhr? && request.format.html?
  end

  resources :posts

  #connections
  get '/connection', to: 'connection#index'
  post '/connection/create', to: 'connection#create'
  post '/connection/:id', to: 'connection#update'
  delete '/connection/:id', to: 'connection#destroy'

end
