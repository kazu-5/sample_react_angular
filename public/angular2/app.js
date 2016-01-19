var apiUrl = $common.config.apiUrl;
var keyid = $common.config.keyid;
var format = $common.config.format;
        
var Index = ng
.Component({
    selector: 'index',
    directives: [ng.CORE_DIRECTIVES],
    template: [
        '<div class="index">',
            '<div>',
                '<a href="javascript:void(0);" (click)="onSearch();">検索する</a>',
            '</div>',
        '</div>',
        '<ul class="search-result">',
            '<li *ng-for="#shop of shops; #i = index">',
                '<p>{{shop.name}}</p>',
                '<p *ng-if="shop.hasShopImage == true">',
                        '<img src="{{shop.image_url.shop_image1}}">',
                    '</p>',
                '<p>住所: {{shop.address}}</p>',
                '<p *ng-if="shop.isLiked">お気に入りに追加済み</p>',
                '<p *ng-if="!shop.isLiked"><a href="javascript:void(0);" (click)="onClick(shop.id);">お気に入りに追加</a></p>',
                '<br/>',
            '</li>',
        '</ul>',
        '</div>'
    ].join('')
})

.Class({
    constructor: function () {
        this.shops = [];
    },
    onClick: function(id){
        this.addLike(id);
    },
    onSearch: function () {
        navigator.geolocation.getCurrentPosition(
            function(position){
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var range = '1';
                $.ajax ({
                    url: apiUrl,
                    dataType: 'jsonp',
                    data: {keyid:keyid,format:format,latitude:latitude,longitude:longitude,range:range},
                    success: function(data) {
                        this.shops = $common.fn.createShops(data);
                    }.bind(this)
                });
            }.bind(this)
        );
    },
    //お気に入りに追加
    addLike: function(id){
        var shops = this.shops;
        likes.unshift(id);
        
        for(var i=0; i<shops.length; i++){
            if(shops[i].id == id){
                shops[i].isLiked = true;
            }
        }
        window.localStorage.setItem('like', JSON.stringify(likes));
    }
});


document.addEventListener('DOMContentLoaded', function () {
	ng.bootstrap(Index);
});