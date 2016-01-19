(function() {
	// このスコープ内でのみ有効な Obj 変数を定義
	var COMMON = window.$common = function() { return new COMMON(); };

    COMMON.config = {
        apiUrl: 'http://api.gnavi.co.jp/RestSearchAPI/20150630/',
        //ぐるなびのkeyId
        keyid: '',
        format: 'json'
    }
	COMMON.fn = {
        /**
         * お気に入りに入れているかを判別
         */
        isLiked: function(shopId){
            var likeShopIds = JSON.parse(window.localStorage.getItem('like'));
            if(likeShopIds == null){
                return false;
            }

            if(likeShopIds.indexOf(shopId.toString()) >= 0){
                return true;
            }else{
                return false;
            }
        },
        /**
         * お気に入りデータをローカルストレージに保存
         */
        saveLike: function(like) {
            window.localStorage.setItem('like', JSON.stringify(like));
        },
        /**
         * お店一覧を作成
         */
        createShops: function(data){
            var shops = [];
            if(data.total_hit_count > 1){
                for(var i=0; i<data.rest.length; i++){
                    shops[i] = data.rest[i];
                    shops[i].isLiked = $common.fn.isLiked(data.rest[i].id);
                    if(typeof shops[i].image_url.shop_image1 == 'string'){
                        shops[i].hasShopImage = true;
                    }else{
                        shops[i].hasShopImage = false;
                    }
                }
            }else if(data.total_hit_count == 1){
                shops[0] = data.rest;
                shops[0].isLiked = $common.fn.isLiked(data.rest.id);
                if(typeof shops[0].image_url.shop_image1 == 'string'){
                    shops[0].hasShopImage = true;
                }else{
                    shops[0].hasShopImage = false;
                }
            }
            return shops;
        }
    }
})();
