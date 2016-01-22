var apiUrl = $common.config.apiUrl;
var keyid = $common.config.keyid;
var format = $common.config.format;

var app = angular.module('MyApp', []);
app.controller('AppController', function($scope, $http) {
    
    //検索
    $scope.search = function() {
        navigator.geolocation.getCurrentPosition(
            function(position){
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var range = '1';
                $http.jsonp(apiUrl, {params: {keyid: keyid, format: format, latitude:latitude, longitude:longitude, range:range,callback:'JSON_CALLBACK' }})
                    .success(function(data, status, headers, config) {
                        $scope.searchShops = $scope.createShops(data);
                        $scope.like = [];
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                    });
            },
            function(error){
                alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
            }
        );
    };
    
    //お気に入りを表示
    $scope.showLikeShop = function(){
        $scope.like = JSON.parse(window.localStorage.getItem('like'));
        
        if (!angular.isArray($scopfe.like)) {
            $scope.like = [];
        } 
        var ids = $scope.like;
        var id = "";
        for (var i = 0 ; i<ids.length ; i++){
            if(i == 0){
                id = id + ids[i];
            }else{
                id = id + ',' + ids[i];
            }
        }
        
        if(ids.length > 0){
            $http.jsonp(apiUrl, {params: {keyid: keyid, format: format,id: id,callback:'JSON_CALLBACK'}})
                .success(function(data, status, headers, config) {
                    $scope.likeShops = $scope.createShops(data);
                })
                .error(function(data, status, headers, config) {
                    alert('error');
                });
        }else{
            $scope.likeShops = [];
        }
    };
    
    //お気に入りに追加
    $scope.addLike = function(e, id){
        e.stopPropagation();
        $scope.like.unshift(id);
        $scope.saveLike($scope.like);
        
        for(var i=0; i<$scope.searchShops.length; i++){
            if($scope.searchShops[i].id == id){
                $scope.searchShops[i].isLiked = true;
            }
        }
    };
    
    //お気に入りをクリア
    $scope.clearLike = function() {
        $scope.like = [];
        $scope.saveLike($scope.like);
        $scope.showLikeShop();
    };
    
    /*
     app.js内で利用される関数
    */
    //お気に入りデータをローカルストレージに保存
    $scope.saveLike = function(like) {
        window.localStorage.setItem('like', JSON.stringify(like));
    };
   
    //お店一覧に表示するデータを作成
    $scope.createShops =function(data){
        var shops = [];
        if(data.total_hit_count > 1){
            for(var i=0; i<data.rest.length; i++){
                shops[i] = data.rest[i];
                shops[i].isLiked = $scope.isLiked(data.rest[i].id);
                if(typeof shops[i].image_url.shop_image1 == 'string'){
                    shops[i].hasShopImage = true;
                }else{
                    shops[i].hasShopImage = false;
                }
            }
        }else if(data.total_hit_count == 1){
            shops[0] = data.rest;
            shops[0].isLiked = $scope.isLiked(data.rest.id);
            if(typeof shops[0].image_url.shop_image1 == 'string'){
                shops[0].hasShopImage = true;
            }else{
                shops[0].hasShopImage = false;
            }
        }
        return shops;
    };
    
    //お気に入りに入れているかを判別
    $scope.isLiked = function(shopId){
        var likeShopIds = JSON.parse(window.localStorage.getItem('like'));
        if(likeShopIds == null){
            return false;
        }
        
        if(likeShopIds.indexOf(shopId.toString()) >= 0){
            return true;
        }else{
            return false;
        }
    };
});

