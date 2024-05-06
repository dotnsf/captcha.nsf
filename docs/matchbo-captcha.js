//. matchbo-captcha.js

//. Language resources
var __lang = window.navigator.language;
//alert( '__lang : ' + __lang );
if( __lang == 'ja-JP' ){  //. #1
  __lang = 'ja';
}
if( __lang != 'ja' && __lang != 'en' ){
  __lang = 'en';
}

var __r = {
  'ja': {
    'tool_title': 'マイキャプチャ',

    'dummy': 'ダミー'
  },
  'en': {
    'tool_title': 'My Captcha',

    'dummy': 'Dummy'
  }
};

var __THIS = null;
var __OPTION = null;

var __base_url = location.origin + '/';

$.fn.matchbo = function( option ){
  __THIS = this;
  __OPTION = option;

  //. lang
  if( !__OPTION || !__OPTION.lang ){ __OPTION.lang = __lang; }

  //. uuid
  if( !__OPTION || !__OPTION.uuid ){ __OPTION.uuid = __generateUUID(); }

  __init();

  return __THIS;
};

function __init(){
  var __html = __THIS.html();
  var new_html = '<div id="__mycaptcha__">'
    + '<h2>' + __r[__OPTION.lang].tool_title + '</h2>'
    + '</div><div id="__original_html" class="__hide_first__">'
    + __html
    + '</div>';
  __THIS.html( new_html );

  //. プロトタイプを定義
  __definePrototype();

  //. リサイズ時に Canvas サイズを変更する
  $(window).on( 'load resize', function(){
  });
}


function __definePrototype(){
  //. プロトタイプ関数

};

//. 内部関数
function __validateAnswer(){
};

function __isAndroid(){
  return ( navigator.userAgent.indexOf( 'Android' ) > 0 );
};

function __timestamp2datetime( __ts ){
  if( __ts ){
    var __dt = new Date( __ts );
    var __yyyy = __dt.getFullYear();
    var __mm = __dt.getMonth() + 1;
    var __dd = __dt.getDate();
    var __hh = __dt.getHours();
    var __nn = __dt.getMinutes();
    var __ss = __dt.getSeconds();
    var __datetime = __yyyy + '-' + ( __mm < 10 ? '0' : '' ) + __mm + '-' + ( __dd < 10 ? '0' : '' ) + __dd
      + ' ' + ( __hh < 10 ? '0' : '' ) + __hh + ':' + ( __nn < 10 ? '0' : '' ) + __nn + ':' + ( __ss < 10 ? '0' : '' ) + __ss;
    return __datetime;
  }else{
    return "";
  }
};

function __generateUUID(){
  //. Cookie の値を調べて、有効ならその値で、空だった場合は生成する
  var __did = null;
  __cookies = document.cookie.split(";");
  for( var __i = 0; __i < __cookies.length; __i ++ ){
    var __str = __cookies[__i].split("=");
    if( unescape( __str[0] ) == " deviceid" ){
      __did = unescape( unescape( __str[1] ) );
    }
  }

  if( __did == null ){
    var __s = 1000;
    __did = ( new Date().getTime().toString(16) ) + Math.floor( __s * Math.random() ).toString(16);
  }
  var __maxage = 60 * 60 * 24 * 365 * 100; //. 100years
  document.cookie = ( "deviceid=" + __did + '; max-age=' + __maxage );

  return __did;
};
