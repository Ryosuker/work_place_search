Rails.application.routes.draw do
  devise_for :users
  root to: "places#index"
  get 'places/index'
end
