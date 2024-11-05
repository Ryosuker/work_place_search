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

## 実装機能


## 今後実装予定の機能


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
- belongs_to :user, place
- has_one_attached :image

## places テーブル
| Column        | Type       | Options                        |
| ------------- | ---------- | ------------------------------ |
| name          | string     | null: false                    |
| address       | string     | null: false                    |
| latitude      | float      | null: false,                   |
| longitude     | float      | null: false                    |
| place_type    | references | null: false, foreign_key: true |
| area          | references | null: false, foreign_key: true |
| googleplaceId | string     |                                |
| phonenumber   | string     |                                |
| website       | string     |                                |

### Association
- belongs_to : place


## Places_Facilities テーブル
| Column       | Type       | Options                        |
| ------------ | ---------- | ------------------------------ |
| place_id     | references | null: false, foreign_key: true |
| facilitie_id | references | null: false, foreign_key: true |

### Association
- belongs_to :place
- belongs_to :facility


## Facilities テーブル
| Column | Type   | Options |
| ------ | ------ | ------- |
| name   | string |         |

### Association
- has_many :places, through: places_facilities

## OpeningHours テーブル
| Column      | Type       | Options                        |
| ----------- | ---------- | ------------------------------ |
| place_id    | references | null: false, foreign_key: true |
| day_of_week | string     |                                |
| open_time   | time       |                                |
| close_time  | time       |                                |

### Association
- has_many :places, through: places_facilities

## Place_type テーブル
| Column            | Type   | Options     |
| ----------------- | ------ | ----------- |
| name              | string | null: false |
| google_place_type | string | null: false |

### Association
- belongs_to  :place

## Areas テーブル
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