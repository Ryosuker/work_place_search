# アプリケーション名
Workplace Search

# URL
https://work-place-search.onrender.com

# アプリケーションを作成した背景
作成者が、出先で勉強や仕事をする場所を探すのにGoogleMapを使って探していたが
イマイチ所望する条件の場所が探しにくかったため作成に至る。
## 課題点
- Web会議したい、静かな場所で勉強したい等、用途によって所望する場所が異なる
- どのくらいの作業スペースなのか写真がない
- 場所の設備の情報が載ってない/正確でない

# 機能
## トップページ
<img src="https://i.gyazo.com/7d4308de247e33877278c4c9082188f9.gif" width="500px">

## 1.ユーザー登録機能
ユーザー登録することでレビュー投稿できるようになります。
（ユーザー登録していない人でも検索見ることは可能です。）

## 2.地図検索機能
Google Map上から検索できます  
[![Image from Gyazo](https://i.gyazo.com/e7337f200facb7012006c9ad85c39629.gif)](https://gyazo.com/e7337f200facb7012006c9ad85c39629)
## 3.施設詳細
登録された施設の詳細情報を閲覧することができます。

<img src="https://i.gyazo.com/c03816ee3aa1a62752aefcf2052f3fa0.jpg" width="500px">

# データベース設計
## ER図

# テーブル設計

## users テーブル
| Column             | Type   | Options                   |
| ------------------ | ------ | ------------------------- |
| email              | string | null: false, unique: true |
| encrypted_password | string | null: false               |
| nickname           | string | null: false               |
| role               | string | default: "user"           |

### Association
- has_many :reviews

## reviews テーブル
| Column  | Type       | Options                        |
| ------- | ---------- | ------------------------------ |
| rating  | integer    | null: false                    |
| comment | text       |                                |
| user    | references | null: false, foreign_key: true |
| place   | references | null: false, foreign_key: true |

### Association
- belongs_to :user, work_place
- has_one_attached :image

## work_places テーブル
| Column        | Type    | Options                               |
| ------------- | ------- | ------------------------------------- |
| type          | string  | null: false                           |
| name          | string  | null: false                           |
| postal_code   | string  |                                       |
| area          | string  |                                       |
| address       | string  |                                       |
| phone_number  | string  |                                       |
| opening_hours | string  |                                       |
| website       | string  |                                       |
| latitude      | decimal | null: false, precision: 10, scale: 7, |
| longitude     | decimal | null: false, precision: 10, scale: 7, |
| place_id      | string  | null: false,                          |


### Association
- has_many :work_place_images, dependent: :destroy
- has_many :reviews, dependent: :destroy

## work_place_images テーブル
| Column     | Type       | Options           |
| ---------- | ---------- | ----------------- |
| image      | string     |                   |
| work_place | references | foreign_key: true |

### Association
-  belongs_to :work_place

## places_facilities テーブル
| Column       | Type       | Options                        |
| ------------ | ---------- | ------------------------------ |
| place_id     | references | null: false, foreign_key: true |
| facilitie_id | references | null: false, foreign_key: true |

### Association
- belongs_to :place
- belongs_to :facility


## facilities テーブル
| Column | Type   | Options |
| ------ | ------ | ------- |
| name   | string |         |

### Association
- has_many :places, through: places_facilities


## areas テーブル
| Column     | Type   | Options     |
| ---------- | ------ | ----------- |
| name       | string | null: false |
| city       | string | null: false |
| prefecture | string | null: false |

### Association
- has_many :places

### 使用しているバージョンなど
ruby 3.2.0
Rails 7.0.8.4
MySQL 8.0.39
Bootstrap 5.3.3
