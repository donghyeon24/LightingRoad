const bottomSheet = document.querySelector('.bottom-sheet');
const report = document.querySelector('.bottom-sheet .report');
const infoSummary = document.querySelector('.bottom-sheet .info-summary');

function markerEvent() {
  bottomSheet.classList.remove('init');
  report.classList.remove('init');

  if (bottomSheet.classList.contains('up')) {
    console.log('데이터 변경');
  } else {
    console.log('데이터 변경');
    bottomSheet.classList.remove('down');
    bottomSheet.classList.add('up');
    report.classList.remove('down');
    report.classList.add('up');
  }
}

function bottomSheetEvent() {
  bottomSheet.classList.remove('init');
  bottomSheet.classList.toggle('down');
  bottomSheet.classList.toggle('up');

  report.classList.remove('init');
  report.classList.toggle('down');
  report.classList.toggle('up');
}

infoSummary.addEventListener('click', () => {
  bottomSheetEvent();
});

var map;
var marker_s, marker_e, marker_p1, marker_p2;
var marker_2,marker_3, marker_4;  // 경유지 변수 추가
var totalMarkerArr = [];
var drawInfoArr = [];
var resultdrawArr = [];

function initTmap() {
  let map = new Tmapv2.Map('map_div', {
    center: new Tmapv2.LatLng(37.570028, 126.989072), // 지도 초기 좌표
    width: '100%',
    height: '650px',
    zoom: 15,
  });

  // 지도 옵션 줌컨트롤 표출 비활성화
  map.setOptions({ zoomControl: false });

  let center = map.getCenter();
  loadGetLonLatFromAddress(center._lat, center._lng);

  map.addListener('dragend', onDragend);
  map.addListener('touchend', onTouchend);

  var markers = [];

  function setMarker(resultData) {
    var positions = [];

    // 기존 marker 제거
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    for (let i = 0; i < resultData.length; i++) {
      positions.push({
        lonlat: new Tmapv2.LatLng(
          resultData[i].latitude,
          resultData[i].longitude
        ),
      });
    }

    for (var i = 0; i < positions.length; i++) {
      //for문을 통하여 배열 안에 있는 값을 마커 생성
      var lonlat = positions[i].lonlat;
      //Marker 객체 생성.
      marker = new Tmapv2.Marker({
        position: lonlat, //Marker의 중심좌표 설정.
        icon: '/static/img/lamp-icon-sm.png', //Marker의 아이콘.
        map: map, //Marker가 표시될 Map 설정.
      });
      markers.push(marker);
    }

    //Marker에 클릭이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('click', (evt) => {
        markerEvent();
      })
    );

    // Marker에 터치이벤트 등록.
    markers.forEach((marker) =>
      marker.addListener('touchstart', (evt) => {
        markerEvent();
      })
    );
  }

  function onDragend(e) {
    loadGetLonLatFromAddress(e.latLng._lat, e.latLng._lng);
  }

  function onTouchend(e) {
    loadGetLonLatFromAddress(e.latLng._lat, e.latLng._lng);
  }

  function adminCodeToViews(code) {
    $.ajax({
      type: 'POST',
      url: 'main2/',
      data: { code: code },
      success: function (response) {
        let data = response.replaceAll(`&quot;`, `"`);
        let placeData = JSON.parse(data);
        console.log(placeData);
        let resultData = placeData['response']['body']['items'];
        setMarker(resultData);
      },
      error: function () {
        console.log('실패-!');
      },
    });
  }

  //리버스 지오코딩 요청 함수
  function loadGetLonLatFromAddress(lat, lng) {
    // TData 객체 생성
    var tData = new Tmapv2.extension.TData();

    var optionObj = {
      coordType: 'WGS84GEO', //응답좌표 타입 옵션 설정 입니다.
      addressType: 'A04', //주소타입 옵션 설정 입니다.
    };

    var params = {
      onComplete: onComplete, //데이터 로드가 성공적으로 완료 되었을때 실행하는 함수 입니다.
      onProgress: onProgress, //데이터 로드 중에 실행하는 함수 입니다.
      onError: onError, //데이터 로드가 실패했을때 실행하는 함수 입니다.
    };
    // TData 객체의 리버스지오코딩 함수
    tData.getAddressFromGeoJson(lat, lng, optionObj, params);
  }

  //리버스 지오코딩
  function onComplete() {
    console.log(this._responseData); //json으로 데이터를 받은 정보들을 콘솔창에서 확인할 수 있습니다.
    let city_do = this._responseData.addressInfo.city_do;
    let gu_gun = this._responseData.addressInfo.gu_gun;
    let address = city_do + ' ' + gu_gun;

    let address_code;

    // 주소 -> 제공기관 코드
    let adminCode = JSON.parse(data);
    for (i = 0; i < adminCode.length; i++) {
      if (adminCode[i]['제공기관명'] == address) {
        address_code = adminCode[i]['제공기관코드'];
        break;
      }
    }

    adminCodeToViews(address_code);
  }

  //데이터 로드중 실행하는 함수입니다.
  function onProgress() {
    //alert("onComplete");
  }

  //데이터 로드 중 에러가 발생시 실행하는 함수입니다.
  function onError() {
    alert('onError');
  }


  // 2. 시작, 도착 심볼찍기
	// 시작
	marker_s = new Tmapv2.Marker(
		{
			position : new Tmapv2.LatLng(37.56689860, 126.97871544),
			icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
			iconSize : new Tmapv2.Size(24, 38),
			map : map
		});
	// 3번째 경유지  GS25
	marker_2 = new Tmapv2.Marker(
		{
			position : new Tmapv2.LatLng(37.56772766459168, 126.99755684423954),
			icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
			iconSize : new Tmapv2.Size(24, 38),
			map : map
		});
	// 2번째 경유지
	marker_3 = new Tmapv2.Marker(
		{
			position : new Tmapv2.LatLng(37.5672089168727, 126.99050799891104),
			icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
			iconSize : new Tmapv2.Size(24, 38),
			map : map
		});
	
	// 도착
	marker_e = new Tmapv2.Marker(
			{
				position : new Tmapv2.LatLng(37.57081522, 127.00160213),
				icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
				iconSize : new Tmapv2.Size(24, 38),
				map : map
			});
		
	var p1 = [126.99050799891104, 37.5672089168727]
	var p2 = [126.99755684423954, 37.56772766459168]
		
	passListData = `${p1[0]},${p1[1]}_${p2[0]},${p2[1]}_`
		
		
	// 3. 경로탐색 API 사용요청
	$
			.ajax({
				method : "POST",
				url : "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
				async : false,
				data : {
					"appKey" : "l7xx277bb41e41d345caae019ce5a6c7b6cb",
					"startX" : "126.97871544",
					"startY" : "37.56689860",
					"endX" : "127.00160213",
					"endY" : "37.57081522",
					"passList" : passListData,
					// "passList" : "126.99050799891104,37.5672089168727_126.99755684423954,37.56772766459168_",   //출발지에 가까운게 제일 처음
					"reqCoordType" : "WGS84GEO",
					"resCoordType" : "EPSG3857",
					"startName" : "출발지",
					"endName" : "도착지"
				},
				success : function(response) {
					var resultData = response.features;
					//결과 출력
					var tDistance = "총 거리 : "
							+ ((resultData[0].properties.totalDistance) / 1000)
									.toFixed(1) + "km,";
					var tTime = " 총 시간 : "
							+ ((resultData[0].properties.totalTime) / 60)
									.toFixed(0) + "분";
					$("#result").text(tDistance + tTime);
					
					//기존 그려진 라인 & 마커가 있다면 초기화
					if (resultdrawArr.length > 0) {
						for ( var i in resultdrawArr) {
							resultdrawArr[i]
									.setMap(null);
						}
						resultdrawArr = [];
					}
					
					drawInfoArr = [];
					for ( var i in resultData) { //for문 [S]
						var geometry = resultData[i].geometry;
						var properties = resultData[i].properties;
						var polyline_;
						if (geometry.type == "LineString") {
							for ( var j in geometry.coordinates) {
								// 경로들의 결과값(구간)들을 포인트 객체로 변환 
								var latlng = new Tmapv2.Point(
										geometry.coordinates[j][0],
										geometry.coordinates[j][1],
										geometry.coordinates[j][2],
										);
								// 포인트 객체를 받아 좌표값으로 변환
								var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
										latlng);
								// 포인트객체의 정보로 좌표값 변환 객체로 저장
								var convertChange = new Tmapv2.LatLng(
										convertPoint._lat,
										convertPoint._lng);
								// 배열에 담기
								drawInfoArr.push(convertChange);
							}
						} else {
							var markerImg = "";
							var pType = "";
							var size;
							if (properties.pointType == "S") { //출발지 마커
								markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
								pType = "S";
								size = new Tmapv2.Size(24, 38);
							} else if (properties.pointType == "E") { //도착지 마커
								markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
								pType = "E";
								size = new Tmapv2.Size(24, 38);
							} else { //각 포인트 마커
								markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
								pType = "P";
								size = new Tmapv2.Size(8, 8);
							}
							// 경로들의 결과값들을 포인트 객체로 변환 
							var latlon = new Tmapv2.Point(
									geometry.coordinates[0],
									geometry.coordinates[1],
									geometry.coordinates[2],
									);
							// 포인트 객체를 받아 좌표값으로 다시 변환
							var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
									latlon);
							var routeInfoObj = {
								markerImage : markerImg,
								lng : convertPoint._lng,
								lat : convertPoint._lat,
								pointType : pType
							};
							// Marker 추가
							marker_p = new Tmapv2.Marker(
									{
										position : new Tmapv2.LatLng(
												routeInfoObj.lat,
												routeInfoObj.lng),
										icon : routeInfoObj.markerImage,
										iconSize : size,
										map : map
									});
						}
					}//for문 [E]
					drawLine(drawInfoArr);
				},
				error : function(request, status, error) {
					console.log("code:" + request.status + "\n"
							+ "message:" + request.responseText + "\n"
							+ "error:" + error);
				}
			});

  
}


// ---------------------------------------------------------------------------------

// var map;
// var marker_s, marker_e, marker_p1, marker_p2;
// var marker_2,marker_3, marker_4;  // 경유지 변수 추가
// var totalMarkerArr = [];
// var drawInfoArr = [];
// var resultdrawArr = [];
// function initTmap() {
// 	// 1. 지도 띄우기
// 	map = new Tmapv2.Map("map_div", {
// 		center : new Tmapv2.LatLng(37.570028, 126.989072),
// 		width : "100%",
// 		height : "650px",
// 		zoom : 15,
// 		zoomControl : true,
// 		scrollwheel : true
// 	});
// 	// 2. 시작, 도착 심볼찍기
// 	// 시작
// 	marker_s = new Tmapv2.Marker(
// 			{
// 				position : new Tmapv2.LatLng(37.56689860, 126.97871544),
// 				icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
// 				iconSize : new Tmapv2.Size(24, 38),
// 				map : map
// 			});
//     // 3번째 경유지  GS25
// 	marker_2 = new Tmapv2.Marker(
//         {
//             position : new Tmapv2.LatLng(37.56772766459168, 126.99755684423954),
//             icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
//             iconSize : new Tmapv2.Size(24, 38),
//             map : map
//         });
//     // 2번째 경유지
// 	marker_3 = new Tmapv2.Marker(
//         {
//             position : new Tmapv2.LatLng(37.5672089168727, 126.99050799891104),
//             icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
//             iconSize : new Tmapv2.Size(24, 38),
//             map : map
//         });

// 	// 도착
// 	marker_e = new Tmapv2.Marker(
// 			{
// 				position : new Tmapv2.LatLng(37.57081522, 127.00160213),
// 				icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
// 				iconSize : new Tmapv2.Size(24, 38),
// 				map : map
// 			});
	
// 	var p1 = [126.99050799891104, 37.5672089168727]
// 	var p2 = [126.99755684423954, 37.56772766459168]

// 	passListData = `${p1[0]},${p1[1]}_${p2[0]},${p2[1]}_`

    
// 	// 3. 경로탐색 API 사용요청
// 	$
// 			.ajax({
// 				method : "POST",
// 				url : "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
// 				async : false,
// 				data : {
// 					"appKey" : "l7xx277bb41e41d345caae019ce5a6c7b6cb",
// 					"startX" : "126.97871544",
// 					"startY" : "37.56689860",
//                     // "secondX" : "126.99505062865539",
// 					// "secondY" : "37.56965032904542",
// 					"endX" : "127.00160213",
// 					"endY" : "37.57081522",
// 					"passList" : passListData,
//                     // "passList" : "126.99050799891104,37.5672089168727_126.99755684423954,37.56772766459168_",   //출발지에 가까운게 제일 처음
// 					"reqCoordType" : "WGS84GEO",
// 					"resCoordType" : "EPSG3857",
// 					"startName" : "출발지",
// 					"endName" : "도착지"
// 				},
// 				success : function(response) {
// 					var resultData = response.features;
// 					//결과 출력
// 					var tDistance = "총 거리 : "
// 							+ ((resultData[0].properties.totalDistance) / 1000)
// 									.toFixed(1) + "km,";
// 					var tTime = " 총 시간 : "
// 							+ ((resultData[0].properties.totalTime) / 60)
// 									.toFixed(0) + "분";
// 					$("#result").text(tDistance + tTime);
					
// 					//기존 그려진 라인 & 마커가 있다면 초기화
// 					if (resultdrawArr.length > 0) {
// 						for ( var i in resultdrawArr) {
// 							resultdrawArr[i]
// 									.setMap(null);
// 						}
// 						resultdrawArr = [];
// 					}
					
// 					drawInfoArr = [];
// 					for ( var i in resultData) { //for문 [S]
// 						var geometry = resultData[i].geometry;
// 						var properties = resultData[i].properties;
// 						var polyline_;
// 						if (geometry.type == "LineString") {
// 							for ( var j in geometry.coordinates) {
// 								// 경로들의 결과값(구간)들을 포인트 객체로 변환 
// 								var latlng = new Tmapv2.Point(
// 										geometry.coordinates[j][0],
// 										geometry.coordinates[j][1],
//                                         geometry.coordinates[j][2],
//                                         );
// 								// 포인트 객체를 받아 좌표값으로 변환
// 								var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
// 										latlng);
// 								// 포인트객체의 정보로 좌표값 변환 객체로 저장
// 								var convertChange = new Tmapv2.LatLng(
// 										convertPoint._lat,
// 										convertPoint._lng);
// 								// 배열에 담기
// 								drawInfoArr.push(convertChange);
// 							}
// 						} else {
// 							var markerImg = "";
// 							var pType = "";
// 							var size;
// 							if (properties.pointType == "S") { //출발지 마커
// 								markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
// 								pType = "S";
// 								size = new Tmapv2.Size(24, 38);
// 							} else if (properties.pointType == "E") { //도착지 마커
// 								markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
// 								pType = "E";
// 								size = new Tmapv2.Size(24, 38);
// 							} else { //각 포인트 마커
// 								markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
// 								pType = "P";
// 								size = new Tmapv2.Size(8, 8);
// 							}
// 							// 경로들의 결과값들을 포인트 객체로 변환 
// 							var latlon = new Tmapv2.Point(
// 									geometry.coordinates[0],
// 									geometry.coordinates[1],
//                                     geometry.coordinates[2],
//                                     );
// 							// 포인트 객체를 받아 좌표값으로 다시 변환
// 							var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
// 									latlon);
// 							var routeInfoObj = {
// 								markerImage : markerImg,
// 								lng : convertPoint._lng,
// 								lat : convertPoint._lat,
// 								pointType : pType
// 							};
// 							// Marker 추가
// 							marker_p = new Tmapv2.Marker(
// 									{
// 										position : new Tmapv2.LatLng(
// 												routeInfoObj.lat,
// 												routeInfoObj.lng),
// 										icon : routeInfoObj.markerImage,
// 										iconSize : size,
// 										map : map
// 									});
// 						}
// 					}//for문 [E]
// 					drawLine(drawInfoArr);
// 				},
// 				error : function(request, status, error) {
// 					console.log("code:" + request.status + "\n"
// 							+ "message:" + request.responseText + "\n"
// 							+ "error:" + error);
// 				}
// 			});
// }
// function addComma(num) {
// 	var regexp = /\B(?=(\d{3})+(?!\d))/g;
// 	return num.toString().replace(regexp, ',');
// }

// function drawLine(arrPoint) {
// 	var polyline_;
// 	polyline_ = new Tmapv2.Polyline({
// 		path : arrPoint,
// 		strokeColor : "#DD0000",
// 		strokeWeight : 6,
// 		map : map
// 	});
// 	resultdrawArr.push(polyline_);
// }