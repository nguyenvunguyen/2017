angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
	'btford.socket-io'
]).config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'Home'
    });
}).factory('mySocket', function (socketFactory) {
	var myIoSocket = io.connect('/webapp');	//Tên namespace webapp

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	return mySocket;
	
/////////////////////// Những dòng code ở trên phần này là phần cài đặt, các bạn hãy đọc thêm về angularjs để hiểu, cái này không nhảy cóc được nha!
}).controller('Home', function($scope, mySocket) {
	////Khu 1 -- Khu cài đặt tham số 
    //cài đặt một số tham số test chơi
	//dùng để đặt các giá trị mặc định
    //$scope.CamBienMua = "Không biết nữa ahihi, chưa thấy có thằng nào cập nhập hết";
    $scope.set= [0,0,0]
	$scope.mode_status = [1, 0]
	$scope.thietbi_status = [0, 0, 0]
	
	////Khu 2 -- Cài đặt các sự kiện khi tương tác với người dùng
	//các sự kiện ng-click, nhấn nút
	$scope.auto  = function() {
		mySocket.emit("AUTO"," ")
	}
	
	
	//Cách gửi tham số 1: dùng biến toàn cục! $scope.<tên biến> là biến toàn cục
	$scope.SETCAMBIEN = function() {
		console.log("SET ", $scope.set)
		
		var json = {
			"set": $scope.set
		}
		mySocket.emit("SET", json)
	}
	
	//cập nhập lcd như một ông trùm 
	$scope.BATTHIETBI_H = function() {
		var json = {
			"QUAT": $scope.thietbi_status[1],
			"BOM":	$scope.thietbi_status[2],
			"MAICHE": $scope.thietbi_status[3]
		}
		mySocket.emit("TAY", json)
	}
	
	
	////Khu 3 -- Nhận dữ liệu từ Arduno gửi lên (thông qua ESP8266 rồi socket server truyền tải!)
	//các sự kiện từ Arduino gửi lên (thông qua esp8266, thông qua server)
	mySocket.on('DOCCAMBIEN', function(json) {
		console.log("DOCCAMBIEN", json)
		$scope.NhietDo = json.NhietDo
		$scope.DoAm = json.DoAm
		$scope.DoAmDat1 = json.DoAmDat1
		$scope.DoAmDat2 = json.DoAmDat2
		$scope.DoAmDat3 = json.DoAmDat3
		$scope.DoAmDat4 = json.DoAmDat4
		$scope.DoAmDat5 = json.DoAmDat5
		$scope.DoAmDat6 = json.DoAmDat6
		$scope.Mua = (json.Mua ==1) ? "Không mưa" : " Có mưa rồi, tắm mưa thôi hihi"
		$scope.AnhSang = (json.AnhSang==0) ? "Sáng rồi,đi ngủ thôi" : "Tối ôm"
	})
	//Khi nhận được lệnh LED_STATUS
	mySocket.on('THIETBI', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("THIETBI", json)
		$scope.QUAT = json.QUAT
		$scope.BOM = json.BOM
		$scope.MAICHE = json.MAICHE
	})
	//khi nhận được lệnh Button
	
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
	mySocket.on('connect', function() {
		console.log("connected")
	})
		
});