Rails.application.routes.draw do
  root to: "places#index"
  get 'places/index'
end
