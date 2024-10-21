class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  PASSSWORD_REGEX = /\A(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+\z/

  validates :password, format: { with: PASSSWORD_REGEX, message: 'は6文字以上で、半角英字と半角数字の両方を含めてください' }
  validates :nickname, presence: true

  # 管理者かどうかを判定するメソッド
  def admin?
    role == "admin"
  end
  # 一般ユーザーかどうかを判定するメソッド（オプション）
  def user?
    role == "user"
  end
end
