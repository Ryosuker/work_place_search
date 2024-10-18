require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'ユーザー新規登録' do
    it 'nicknameが空では登録できない' do
      user = User.new(nickname: '', email: 'test@example', password: '000a000', password_confirmation: '000a000')
      user.valid?
      
      binding.pry
      
      expect(user.errors.full_messages).to include("Nickname can't be blank")
    end
  end
end