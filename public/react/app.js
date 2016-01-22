var apiUrl = $common.config.apiUrl;
var keyid = $common.config.keyid;
var format = $common.config.format;

var LikeButton = React.createClass({
  render: function() {
      var isLiked = this.props.isLiked;
      
      if(isLiked){
            return(
                <p>お気に入りに追加済み</p>
            );
      }else{
          return(
                <p><a href="javascript:void(0);" onClick={this.props.onLike}>お気に入りに追加する</a></p>
            );
      }
     
  }
});

var SearchResult = React.createClass({
    onLike: function(){
        var id = this.props.data.id;
        this.props.onLike(id);
    },
    render: function() {
        var shop = this.props.data;
        var onLike = this.props.onLike;
        var imageArea =(function(hasShopImage,shopImageUrl){
            if(hasShopImage){
                return(
                    <p>
                    <img src={shopImageUrl}/>
                    </p>
                );
            }else{
                return "";
            }
        })(shop.hasShopImage,shop.image_url.shop_image1);
            return (
                <li className="search-result">
                    <div>
                        <p>
                            {shop.name}
                        </p>
                        {imageArea}
                        <p>住所: {shop.address}</p>
                        <LikeButton isLiked={shop.isLiked} id ={shop.id} onLike={this.onLike}/>
                        <br/>
                    </div>
                </li>
            );
    }
});

var SearchResultList = React.createClass({
    render: function() {
        // 行数分のリストを格納したノードを生成
        // 親ノードから受け取ったdataはpropsで受け取れます
        var data = this.props.data;
        
        if(typeof data === 'undefined'){
            return "";
        }else{
            var result = function(row,i){
                  return (
                    <SearchResult key={i} data={row} onLike={this.props.onLike}/>
                  );
                };
            return (
                <ul>{this.props.data.map(result,this)}</ul>
            );
        }
    }
});

var Index = React.createClass({
    getInitialState: function() {
        return {
            shops: []
        };
    },
    onLike: function(id){
        var likes = JSON.parse(window.localStorage.getItem('like'));
        if(likes !=null && likes.length != 0){
            likes.unshift(id);
        }else{
            likes = [id];
        }
        window.localStorage.setItem('like', JSON.stringify(likes));
        
        var shops = this.state.shops;
        for(var i=0; i<shops.length; i++){
            if(shops[i].id == id){
                shops[i].isLiked = true;
            }
        }
        
        //表示を書き換え
        this.setState({shops: shops});
    },
    onSearch: function() {
        navigator.geolocation.getCurrentPosition(
            function(position){
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var range = '1';
                this.setState({data: []});
                $.ajax ({
                    url: apiUrl,
                    dataType: 'jsonp',
                    data: {keyid:keyid,format:format,latitude:latitude,longitude:longitude,range:range},
                    success: function(data) {
                        var searchShops = $common.fn.createShops(data);
                        this.setState({shops: searchShops});
                    }.bind(this),
                    error: function(xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });
            }.bind(this)
        );
    },
    //お気に入りをクリア
    clearLike: function() {
        var like = [];
        window.localStorage.setItem('like', JSON.stringify(like));
        this.onSearch();
    },
    render: function(){
        return (
            <div className="index">
                <p>
                    <a href="javascript:void(0);" onClick={this.onSearch}>検索する</a>
                </p>
                <p>
                    <a href="javascript:void(0);" onClick={this.clearLike}>お気に入りをクリア</a>
                </p>
                <SearchResultList data={this.state.shops} onLike={this.onLike} />
            </div>
        );
    }
});

ReactDOM.render(
    <Index/>,
    document.getElementById('content')
);
