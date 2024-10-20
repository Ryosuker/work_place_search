# README

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization
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