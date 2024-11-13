require 'csv'
require 'open-uri'
require 'json'

API_KEY = ENV['GOOGLE_MAPS_API_KEY']

namespace :create_csv do
  desc "Fetch library data and save as CSV"
  task fetch_data: :environment do
    tokyoku = ["足立区","荒川区","板橋区","江戸川区","大田区","江東区","品川区","渋谷区","新宿区","杉並区","墨田区","世田谷区","台東区","中央区","千代田区","豊島区","中野区","練馬区","文京区","港区","目黒区"]
    cafeshop = ["コワーキングスペース"]

    
    place_detail_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    csv_file = 'lib/cowork_speace.csv'

    # CSVファイルを開く
    CSV.open(csv_file, "w") do |csv|
      csv << ["都道府県", "施設名", "住所","place_id"]  # ヘッダー

      tokyoku.each do |tokyoku|
        cafeshop.each do |cafeshop|
          #GoogleMapsAPIを用いて指定したクエリでスクレイピング
            query = tokyoku + cafeshop
            place_detail_query = URI.encode_www_form(
              query: query,
              language: 'ja',
              key: API_KEY
            )
            response = URI.open("#{place_detail_url}?#{place_detail_query}")
            place_detail_data = JSON.parse(response.read)

            # エラーハンドリング
            if place_detail_data["status"] != "OK"
              puts "API Error: #{place_detail_data['status']}"
              break
            end

            # データをCSVに保存
            libraries = place_detail_data['results']
            libraries.each do |library|
              csv << [
                '東京',
                library['name'],
                library['formatted_address'],
                library['place_id']
              ]
            end
        end
      end
    end

    puts "Data successfully saved to tokyo_libraries_google_places.csv"
  end
end

