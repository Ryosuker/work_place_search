var map;
var pin;
var circle;
var lat = gon.latitude;
var lng = gon.longitude;
var cafesMarker = [];
var coworksMarker = [];
var librariesMarker = [];
var API_KEY = gon.api_key;
var currentFilter = 'all';
var maxMarkers = 10;
var infoWindow;

function initMap() {
  // GoogleMapの作成
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: new google.maps.LatLng(lat, lng),
    mapTypeId: 'roadmap',
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: false,
    mapTypeControl: false,
    draggable: true,
    scrollwhell: true,
    diableDoubleClickZoom: true,
    gestureHandling: 'greedy',
    styles: [
      {
        featureType: 'all',
        elementType: 'all',
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          { visibility: 'off' },
        ],
      }
    ]
  });
  // ピンの作成
  pin = new google.maps.Marker({
    map: map,
    draggable: true,
    position: new google.maps.LatLng(lat, lng),
  });
  // サークルの作成
  circle = new google.maps.Circle({
    map: map,
    center: new google.maps.LatLng(lat, lng),
    radius: 1000, //半径を指定(半径1km)
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: "#FF0000",
    fillOpacity: 0.1, 
  });
  // 検索ボックスの作成
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    var place = places[0];
    lat = place.geometry.location.lat();
    lng = place.geometry.location.lng();

    pin.setPosition(new google.maps.LatLng(lat, lng));

    circle.setCenter(new google.maps.LatLng(lat, lng));

    map.setCenter(new google.maps.LatLng(lat, lng));
  });
  //現在地ボタンの作成
  infoWindow = new google.maps.InfoWindow();
  var currentLocationButton = document.createElement('button');
  currentLocationButton.textContent = "現在地へ移動";
  currentLocationButton.className = "border-2 rounded-full border-orange-400 bg-orange-400 py-2 px-4 md:px-8 mt-2 mr-2 text-center text-xs md:text-base text-white font-bold hover:bg-orange-600";
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(currentLocationButton);
  // 現在地ボタンに対して、クリックすることでイベントが発火するように設定
  currentLocationButton.addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude
          lng = position.coords.longitude

          pin.setPosition(new google.maps.LatLng(lat, lng));

          circle.setCenter(new google.maps.LatLng(lat, lng));

          map.setCenter(new google.maps.LatLng(lat, lng));

          infoWindow.setPosition(new google.maps.LatLng(lat, lng));
          infoWindow.setContent("現在地を取得しました");
          infoWindow.open(map);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  
  // 施設別検索
  document.getElementById('search-cafe-button').addEventListener('click', function () {
    currentFilter = 'cafe';
    filterSearch(currentFilter);
    setFlashMessage("success", "カフェのみで検索ができます");
  });
  document.getElementById('search-cowork-button').addEventListener('click', function () {
    currentFilter = 'cowork';
    filterSearch(currentFilter);
    setFlashMessage("success", "コワーキングスペースのみで検索ができます");
  });
  document.getElementById('search-library-button').addEventListener('click', function () {
    currentFilter = 'library';
    filterSearch(currentFilter);
    setFlashMessage("success", "図書館のみで検索ができます");
  });

  // マップとピンに対して、ドラッグ（スワイプ）することでイベントが発火するように設定
  map.addListener('dragend', updateSearch);
  pin.addListener('dragend', updateSearch);
}
window.initMap = initMap;


function updateSearch() {
  pin.setPosition(map.getCenter());
  circle.setCenter(map.getCenter());
  filterSearch(currentFilter);
}

function filterSearch(filterType) {
  var circleCenter = circle.getCenter();
  var radius = circle.getRadius();
  var circleLatLng = {
    latitude: circleCenter.lat(),
    longitude: circleCenter.lng()
  };

  var filterParam = '';

  if (filterType === 'cafe') {
    filterParam = 'is_cafe_filter=true';
  } else if (filterType === 'cowork') {
    filterParam = 'is_cowork_filter=true';
  } else if (filterType === 'library') {
    filterParam = 'is_library_filter=true';
  } 

  // fetchを使用して、mapsコントローラのindexアクションへリクエストを送信する。この際に、クエリ文字列として緯度と経度をもたせる。
  // こうすることで、indexコントローラでparams[:latitude」の形で使用できる。
  fetch(`/index.json?latitude=${circleLatLng.latitude}&longitude=${circleLatLng.longitude}&${filterParam}`)
    .then(response => response.json())
    .then(data => {
      clearMarkers();
    
      updatePlaceList('cafes', data.cafes);
      updatePlaceList('coworks', data.coworks);
      updatePlaceList('libraries', data.libraries);
    })
    .catch(error => console.error('Error:', error));
}
// 検索でヒットした施設を表示し、マップ上にマーカーを表示する関数
function updatePlaceList(type, places) {
  const placesListElement = document.getElementById(`${type}-list`);
  placesListElement.innerHTML = '';
  const userIsLoggedIn = gon.user_logged_in;//⭐️あとで確認
  
  if (places && places.length > 0) {

    const limitedPlaces = places.slice(0, 15);

    addMarkers(limitedPlaces, type);

    limitedPlaces.forEach(place => {
      const place_image = place.place_images[0];

      const placeCard = document.createElement('div');
      placeCard.className = 'card w-11/12 bg-base-200 border-gray-500 shadow-xl m-2 md:m-3';

      const cardContent = `
        <div class="flex" data-controller="modal">
          <a href="/places/${place.id}">
            <img src="https://maps.googleapis.com/maps/api/place/photo?maxheight=200&maxwidth=200&photo_reference=${place_image.image}&key=${API_KEY}" class="p-3 md:p-5 w-20 h-20 md:w-28 md:h-28 xl:w-36 xl:h-36 rounded-3xl">
          </a>
          <div class="flex-col">
            <ul>
              <li class="xl:pl-1 pt-3 text-[9px] md:text-sm xl:text-xl underline hover:text-yellow-500"><a href="/places/${place.id}">${place.name}</a></li>
              <li class="pl-1 xl:pl-3 mt-1 md:mt-1.5 text-[7px] md:text-[10px] xl:text-xs">${place.address}</li>
              <li class="pl-1 xl:pl-3 mt-1 xl:mt-1.5 text-[7px] md:text-[10px] xl:text-xs">${place.phone_number}</li>
              <a href="https://www.google.com/maps/search/?api=1&query=${place.name}&query_place_id=${place.place_id}" target=_"blank" rel="noopener noreferrer">
              <li class="mb-1.5 py-1 md:py-1.5 xl:py-2 px-2 mt-1 xl:mt-1.5 text-[8px] md:text-[10px] xl:text-xs text-center rounded-full bg-blue-500 text-white font-bold w-24 md:w-28 hover:bg-blue-600">
                <i class="fa-solid fa-location-dot"></i>
                GoogleMap
              </li>
              </a>
            </ul>
          </div>
        </div>
      `;

      placeCard.innerHTML = cardContent;
      placesListElement.appendChild(placeCard);
    });
  } else {
    const noPlacesElement = document.createElement('p');
    noPlacesElement.textContent = '近くにショップはありません';
    noPlacesElement.className = 'text-xs md:text-lg pt-5 text-center mb-5';
    placesListElement.appendChild(noPlacesElement);
  }
}
//Mapにピンを置く
function addMarkers(places, type) {
  const markers = {
    cafes: cafesMarker,
    coworks: coworksMarker,
    libraries: librariesMarker,
  }[type];
  for (var i = 0; i < places.length && i < maxMarkers; i++) {
    var markerIcon = '/images/' + type.toLowerCase() + '_' + (i + 1) + '.png';

    let marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(places[i].latitude, places[i].longitude),
      icon: markerIcon
    });

    const infowindow = new google.maps.InfoWindow({
      content: '<div class="hover:text-yellow-500"><a href="/work_places/' + places[i].id + '">' + places[i].name + '</a></div>'
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

    markers.push(marker);
  }
}
//配置済みマーカーのクリア
function clearMarkers() {
  cafesMarker.forEach(marker => marker.setMap(null));
  coworksMarker.forEach(marker => marker.setMap(null));
  librariesMarker.forEach(marker => marker.setMap(null));
  clothesMarker = [];
  cafesMarker = [];
  coworksMarker = [];
  librariesMarker = [];
}

function handleLocationError(browserHasGeolocation, infoWindow, lat, lng) {
  infoWindow.setPosition(new google.maps.LatLng(lat, lng));
  infoWindow.setContent(
    browserHasGeolocation
      ? "現在地を取得できませんでした"
      : "お使いのブラウザではサポートされていません"
  );
  infoWindow.open(map);
}

function setFlashMessage(type, message) {
  const flashContainer = document.createElement("div");
  flashContainer.classList.add("flex", "items-center", "text-white", "text-xs", "md:text-sm", "font-bold", "pl-10", "py-5");

  if (type === "success") {
    flashContainer.classList.add("bg-green-400");
  } else if (type === "error") {
    flashContainer.classList.add("bg-red-400");
  }

  flashContainer.textContent = message;

  const flashContainerElement = document.getElementById("flash");

  if (flashContainerElement) {
    flashContainerElement.appendChild(flashContainer);
    setTimeout(() => {
      flashContainerElement.removeChild(flashContainer);
    }, 4000)
  }
}
