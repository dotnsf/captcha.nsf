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
    'before_load': '少しお待ちください・・',
    'instruction1': 'マッチ棒を１本だけ動かして、式を成立させてください。',
    'instruction2': 'ただし使える数字および記号は以下のものだけとします:',
    'question': '出題',
    'answer': '回答',
    'submit_button': '回答送信',
    'congrats': '正解です、送信可能です！',

    'dummy': 'ダミー'
  },
  'en': {
    'tool_title': 'My Captcha',
    'before_load': 'Wait a moment..',
    'instruction1': 'Create valid formula with only "one" stick "move".',
    'instruction2': 'You can use following numbers and symbols only:',
    'question': 'Question',
    'answer': 'Your answer',
    'submit_button': 'Submit Answer',
    'congrats': 'Congrats! Now you can submit!',

    'dummy': 'Dummy'
  }
};

var __THIS = null;
var __OPTION = null;

var __base_url = location.origin + '/';

var __formula__ = null;
var __num__ = null;
var __start_time__ = null;

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
    + '<h2>' + __r[__OPTION.lang].before_load + '</h2>'
    + '</div><div id="__original_html" class="__hide_first__">'
    + __html
    + '</div>';
  __THIS.html( new_html );

  //. プロトタイプを定義
  __definePrototype();

  $.ajax({
    url: 'https://matchbodb.yellowmix.net/api/db/generated',
    //url: './generated.json',
    type: 'GET',
    success: function( result ){
      if( result && result.status ){
        var formula_list = result.results;
        var dt = new Date();

        var tm = dt.getTime();
        __start_time__ = tm;
        var random = new Random( tm );
        var idx = random.nextInt( 0, formula_list.length );

        var f = formula_list[idx];
        __formula__ = f.formula;
        //__num__ = f.num;

        var mycaptcha_div = '<div id="__mycaptcha_main_div__" class="float-right">'
          + '<div>'
          + '<div class="__mycaptcha_question__">'
          + __r[__OPTION.lang].instruction1 + '<br/>'
          + __r[__OPTION.lang].instruction2 + '<br/>'
          + '<img src="https://matchbodb.yellowmix.net/api/db/image?formula=0123456789+-*/=" width="400px"/><p/>'
          + __r[__OPTION.lang].question + ' <input type="text" disabled="true" value="' + __formula__ + '" id="__mycaptcha__formula__"/><br/>'
          + '<span id="__mycaptcha_formula_matchbo"><img id="__mycaptcha_formula_matchbo_image__" src="https://matchbodb.yellowmix.net/api/db/image?formula=' + __formula__ + '" width="50%"/></span>'
          + '<input type="hidden" name="__mycaptcha_formula__" id="__mycaptcha_formula__" value="' + __formula__ + '"/>'
          + '<input type="hidden" name="__mycaptcha_time__" id="__mycaptcha_time__" value="0"/>'
          + '</div>'
          + '<div class="__mycaptcha_answer__">'
          + __r[__OPTION.lang].answer + ' <input type="text" value="" id="__mycaptcha_answer__"/>'
          + '<button class="btn btn-xs btn-success" id="__mycaptcha_answer_matchbo_button__" onClick="__mycaptcha_matchbo_submit();">' + __r[__OPTION.lang].submit_button + '</button><br/>'
          + '<span id="__mycaptcha_answer_matchbo"><img id="__mycaptcha_answer_matchbo_image__" src="" width="50%"/></span>'
          + '</div>'
          + '</div>'
          + '</div>';
        $('#__mycaptcha__').html( mycaptcha_div );

        $('#__mycaptcha_answer__').keydown( function( e ){
          var k = e.key;
          //console.log( 'keydown: k=' + k );
          var r = true;
          if( ( '0' <= k && k <= '9' ) ){
            //. 数字
          }else if( k == '+' || k == '-' || k == '*' || k == '/' || k == '=' ){
            //. 記号
          }else if( k.startsWith( 'Arrow' ) ){
            //. カーソル
          }else if( k == ' ' || k == 'Backspace' || k == 'Enter' || k == 'Delete' || k == 'Insert' ){
            //. 編集(SPC,BS,DEL,INS,ENTER)
          }else{
            r = false;
          }

          return r;
        });

        $('form').submit( function(){
          //console.log( 'form-submit: return false' );
          //return false;
        });

        $('#__mycaptcha_answer__').keyup( function( e ){
          var text = $('#__mycaptcha_answer__').val().split( ' ' ).join( '' );
          $('#__mycaptcha_answer_matchbo_image__').prop( 'src', 'https://matchbodb.yellowmix.net/api/db/image?formula=' + text );
        });
      }
    },
    error: function( e0, e1, e2 ){
      console.log( e0, e1, e2 );
    }
  });
}


function __definePrototype(){
  //. プロトタイプ関数

} 

function __mycaptcha_matchbo_submit(){
  var text = $('#__mycaptcha_answer__').val().split( ' ' ).join( '' );

  $.ajax({
    url: 'https://matchbodb.yellowmix.net/api/db/solve?formula=' + __formula__,
    type: 'GET',
    success: function( result ){
      if( result && result.status && result.answers ){
        var b = false;
        for( var i = 0; i < result.answers.length && !b; i ++ ){
          var answer = result.answers[i].formula;
          b = ( text == answer );
          //console.log( i, {answer}, b );
        }

        if( b ){
          var tm_start = __start_time__;
          var tm_end = ( new Date() ).getTime();
          var tm_sec = ( tm_end - tm_start ) / 1000;
          $('#__mycaptch_time__').val( tm_sec );
          $('#__mycaptch_answer__').prop( 'disabled', 'true' );
          $('#__mycaptcha_answer_matchbo_button__').prop( 'disabled', 'true' );

          alert( __r[__OPTION.lang].congrats );
          $('#__original_html').removeClass( '__hide_first__' );
          $('#__mycaptcha_main_div__').addClass( '__hide_first__' );

          $('form').submit( function(){
            //console.log( 'form-submit: return true' );
            //return true;
          });
        }
      }else{
      }
    },
    error: function( e0, e1, e2 ){
      console.log( e0, e1, e2 );
    }
  });
}

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


//. #37 : https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/
class Random {
  constructor(seed = 19681106) {
    this.x = 31415926535;
    this.y = 8979323846;
    this.z = 2643383279;
    this.w = seed;
  }
  
  // XorShift
  next() {
    let t;
 
    t = this.x ^ (this.x << 11);
    this.x = this.y; this.y = this.z; this.z = this.w;
    return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
  }
  
  // min以上max以下の乱数を生成する
  nextInt(min, max) {
    const r = Math.abs(this.next());
    return min + (r % (max + 1 - min));
  }
}
