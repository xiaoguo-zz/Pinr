function getVideoId(url) {
    if (url.indexOf('watch') > -1) {
        return url.slice(url.indexOf('v=')+2).match(/^[a-zA-Z0-9]+/)[0];
    } else if (url.indexOf("youtu.be/")) {
        return url.slice(url.indexOf("youtu.be/")+9);
    } else {
        throw "Invalid youtube url";
    }

}function PinrCtl($scope, $http) {
    $http.get('/items').success(function(data){
	$scope.items = data.items;	
    });
      
    $scope.filter_text = true;
    $scope.filter_image = true;
    $scope.filter_video = true;
    
    $scope.isActive = function(item) { 
        if (item.type === 'text' && $scope.filter_text) {
                 return true; 
            }

            if (item.type === 'image' && $scope.filter_image) {
                 return true; 
            }

            if (item.type === 'video' && $scope.filter_video) {
                 return true; 
            }     
   
            // if it's some other type, default to false;
            return false;
    }
    
    $scope.showMenu = function(which) {
        if ($(which).is(':visible')) {
            $(".dropdown").hide();
        } else {
            $(".dropdown").hide();
            $(which).show();
        }
    }

    $scope.addText = function() {
    	var data = {text: $scope.text, type: 'text'}
    	$http.post('/items', data).success(function(data) {
		$scope.items.push(data.items);
		$(".dropdown").hide();
		$scope.text = "";
	});
    }

    $scope.addImage = function() {
	var data = {image_url: $scope.image_url, image_caption: $scope.image_caption, type: 'image'}
	$http.post('/items', data).success(function(data) {
		$scope.items.push(data.items);
                $(".dropdown").hide();
                $scope.image_url = "";
		$scope.image_caption = "";
	});	
    }
   
    $scope.addVideo = function() {
        var data = {video_id: getVideoId($scope.video_url), type: 'video'}
        $http.post('/items', data).success(function(data) {
                $scope.items.push(data.items);
                $(".dropdown").hide();
                $scope.video_url = "";
        });
    }

    $scope.remove = function(item) { 
    	$http.delete('/item/'+item._id).success(function() {
            $scope.items.splice($scope.items.indexOf(item),1);
            $scope.showThis = false;
    	});
    }

    $scope.share = function(item) { 
        $http.put('/item/'+item._id, {ip_addr: $scope.ip_addr}).success(function(){
            alert("success");
        });
    }
    
    $scope.showThis = false;
}
