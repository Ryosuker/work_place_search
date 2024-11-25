require 'csv'
require 'open-uri'

namespace :Library do
  desc 'Fetch and save workplace details'
  task :get_and_save_details => :environment do
    API_KEY = ENV['GOOGLE_MAPS_API_KEY']
    #place_idから詳細情報（Place Details）を取得してresultハッシュを返す
    def get_detail_data(workplace)
      place_id = workplace['place_id']

      if place_id
        existing_Workplace = WorkPlace.find_by(place_id: place_id) # データベース内を検索
        if existing_Workplace
          puts "既に保存済みです: #{workplace['施設名']}"
          return nil
        end

        place_detail_query = URI.encode_www_form(
          place_id: place_id,
          language: 'ja',
          key: API_KEY
        )
        place_detail_url = "https://maps.googleapis.com/maps/api/place/details/json?#{place_detail_query}"
        place_detail_page = URI.open(place_detail_url).read
        place_detail_data = JSON.parse(place_detail_page)

        result = {}
        result[:type] = 'Library'
        result[:name] = workplace['施設名']
        result[:postal_code] = place_detail_data['result']['address_components'].find { |c| c['types'].include?('postal_code') }&.fetch('long_name', nil)
        result[:area] = place_detail_data['result']['address_components'].find { |c| c['types'].include?('locality') }&.fetch('long_name', nil)
        
        full_address = place_detail_data['result']['formatted_address']
        result[:address] = full_address.sub(/\A[^ ]+/, '')

        result[:phone_number] = place_detail_data['result']['formatted_phone_number']
        result[:opening_hours] = place_detail_data['result']['opening_hours']['weekday_text'].join("\n") if place_detail_data['result']['opening_hours'].present?
        result[:latitude] = place_detail_data['result']['geometry']['location']['lat']
        result[:longitude] = place_detail_data['result']['geometry']['location']['lng']
        result[:place_id] = place_id
        result[:web_site] = place_detail_data['result']['website']

        result
      else
        puts "詳細情報が見つかりませんでした。"
        nil
      end
    end
    #resultハッシュ内のplace_idで施設の写真を５枚取得して返す
    def photo_reference_data(place_data)
      if place_data
        place_id = place_data[:place_id]
        place_detail_query = URI.encode_www_form(
          place_id: place_id,
          language: 'ja',
          key: API_KEY
        )
        place_detail_url = "https://maps.googleapis.com/maps/api/place/details/json?#{place_detail_query}"
        place_detail_page = URI.open(place_detail_url).read
        place_detail_data = JSON.parse(place_detail_page)

        photos = place_detail_data['result']['photos'] if place_detail_data['result']['photos'].present?
        photo_references = []

        if photos.present?
          photos.take(5).each do |photo|
            photo_references << photo['photo_reference']
          end
          photo_references
        else
          nil
        end
      else
        puts "詳細データがありません"
        return nil
      end
    end

    csv_file = 'lib/Libraries.csv'
    CSV.foreach(csv_file, headers: true) do |row|
      place_data = get_detail_data(row)
      if place_data
        workplace = WorkPlace.create!(place_data)
        puts "WorkPlace(Library)を保存しました: #{row['施設名']}"
        puts "----------"
      else
        puts "WorkPlace(Library)の保存に失敗しました: #{row['施設名']}"
      end

      photo_references = photo_reference_data(place_data)
      if photo_references.present?
        photo_references.each do |photo|
          WorkPlaceImage.create!(work_place: workplace, image: photo)
        end
        puts "WorkPlaceImageを保存しました: #{row['施設名']}"
        puts "----------"
      else
        puts "WorkPlaceImageの保存に失敗しました: #{row['施設名']}"
      end
    end
  end
end
