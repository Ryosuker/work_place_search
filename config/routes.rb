Rails.application.routes.draw do
  devise_for :users
  root to: "places#index"

  resources :places, only: :index do
    collection do
      get 'maps'
    end
  end

end
