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
    'instruction3': 'スライドパズルを完成させてください：',
    'question': '出題',
    'answer': '回答',
    'toggleNumbersLabel': '数値表示／非表示',
    'submit_button': '回答送信',
    'cleared': 'キャプチャ　クリア済み',
    'congrats': '正解です、送信可能です！',

    'dummy': 'ダミー'
  },
  'en': {
    'tool_title': 'My Captcha',
    'before_load': 'Wait a moment..',
    'instruction1': 'Create valid formula with only "one" stick "move".',
    'instruction2': 'You can use following numbers and symbols only:',
    'instruction3': 'Complete Slide-Puzzle:',
    'question': 'Question',
    'answer': 'Your answer',
    'toggleNumbersLabel': 'Numbers',
    'cleared': 'Captcha cleared.',
    'submit_button': 'Submit Answer',
    'congrats': 'Congrats! Now you can submit!',

    'dummy': 'Dummy'
  }
};

var __slide_settings__ = {
  rows: 4,  //. パズルサイズ（行数）
  cols: 4,  //. パズルサイズ（列数）
  hole: 16, //. 開けるピース
  shuffle: true,  //. 初期状態でシャッフル済み
  numbers: false, //. 初期状態では数字なし
  language: __lang, //'ja',
  control: {
    shufflePieces: false, //. シャッフルボタン無し
    confirmShuffle: true, //. シャッフル時に確認する
    toggleOriginal: false, //. 正解プレビューなし,
    toggleNumbers: true, //. 数字表示／非表示のトグルボタンあり
    counter: false, //. 回数非表示
    timer: false, //. タイマー非表示
    pauseTimer: false //. タイマーストップ無し
  },
  success: {
    fadeOriginal: false,
    callback: function( results ){
      //alert( '移動回数: ' + results.moves + '回, かかった時間: ' + results.seconds + '秒' );
      __mycaptcha_slidepuzzle_submit( results );
    },
    callbackTimeout: 300
  },
  animation: {
    shuffleRounds: 3,
    shuffleSpeed: 800,
    slidingSpeed: 200,
    fadeOriginalSpeed: 600
  },
  style: {
    gridSize: 2,
    overlap: true,
    backgroundOpacity: 0.1
  }
};
var __slide_texts__ = {
  shuffleLabel: 'シャッフル',
  toggleOriginalLabel: '元画像',
  toggleNumbersLabel: '', //. ここだけ後で変更する
  confirmShuffleMessage: 'シャッフルしてよろしいですか？',
  movesLabel: '回',
  secondsLabel: '秒'
};

var __THIS = null;
var __OPTION = null;
var __MODE = null;

var __base_url = location.origin + '/';

var __formula__ = null;
var __loaded__ = false;
var __start_time__ = ( new Date() ).getTime();
var __submit_fire__ = false;

$.fn.mycaptcha = function( option ){
  __THIS = this;
  __OPTION = option;
  __MODE = 'matchbo';

  //. lang
  if( !__OPTION || !__OPTION.lang ){ __OPTION.lang = __lang; }

  //. uuid
  if( !__OPTION || !__OPTION.uuid ){ __OPTION.uuid = __generateUUID(); }

  //. mode
  if( __OPTION && __OPTION.mode ){ __MODE = __OPTION.mode; }

  __slide_texts__.toggleNumbersLabel = __r[__OPTION.lang].toggleNumbersLabel; //. ここだけ使う

  __init();

  return __THIS;
};

function __init(){
  if( __loaded__ ){
  }else{
    __loaded__ = true;
    var __html = __THIS.html();
    var new_html = '<div id="__mycaptcha__">'
      + '<h2>' + __r[__OPTION.lang].before_load + '</h2>'
      + '</div>'
      + '<div id="__original_html" class="__hide_first__">'
      + '<div><img src="//dotnsf.github.io/captcha.nsf/check.png" height="20px" /> ' + __r[__OPTION.lang].cleared + '</div>'
      + __html
      + '</div>';
    __THIS.html( new_html );

    //. プロトタイプを定義
    __definePrototype();

    if( __MODE == 'matchbo' ){
      $.ajax({
        url: 'https://matchbodb.yellowmix.net/api/db/generated',
        //url: './generated.json',
        type: 'GET',
        success: function( result ){
          if( result && result.status ){
            var formula_list = result.results;
  
            var random = new Random( __start_time__ );
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
              + '<input type="hidden" name="__mycaptcha_mode__" id="__mycaptcha_mode__" value="matchbo"/>'
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

            $('form').submit( function( e ){
              return __submit_fire__;
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
    }else if( __MODE == 'slidepuzzle' ){
      var mycaptcha_div = '<div id="__mycaptcha_main_div__" class="float-right">'
        + '<div>'
        + '<div class="__mycaptcha_question__">'
        + __r[__OPTION.lang].instruction3 + '<br/>'
        + '<img id="slidegame_img" class="jqPuzzle"/><p/>'
        + '<input type="hidden" name="__mycaptcha_mode__" id="__mycaptcha_mode__" value="slidepuzzle"/>'
        + '<input type="hidden" name="__mycaptcha_formula__" id="__mycaptcha_formula__" value=""/>'
        + '<input type="hidden" name="__mycaptcha_time__" id="__mycaptcha_time__" value="0"/>'
        + '</div>'
        + '<div class="__mycaptcha_answer__">'
        + '</div>'
        + '</div>'
        + '</div>';
      $('#__mycaptcha__').html( mycaptcha_div );

      $('form').submit( function( e ){
        return __submit_fire__;
      });

      var gif_idx = ( ( new Date() ).getTime() ) % 10;
      var image_file_path = 'https://raw.githubusercontent.com/dotnsf/captcha.nsf/main/docs/gifs/anime_gif_0' + gif_idx + '.gif';
      $('#slidegame_img').prop( 'src', image_file_path );
      $('#slidegame_img').prop( 'width', 400 );
      var t = $('img.jqPuzzle');
      t.jqPuzzle( __slide_settings__, __slide_texts__ );
    }
  }
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
          $('#__mycaptcha_time__').val( tm_sec );
          $('#__mycaptcha_answer__').prop( 'disabled', 'true' );
          $('#__mycaptcha_answer_matchbo_button__').prop( 'disabled', 'true' );

          alert( __r[__OPTION.lang].congrats );
          $('#__original_html').removeClass( '__hide_first__' );
          $('#__mycaptcha_main_div__').addClass( '__hide_first__' );

          __submit_fire__ = true;
        }
      }else{
      }
    },
    error: function( e0, e1, e2 ){
      console.log( e0, e1, e2 );
    }
  });
}

function __mycaptcha_slidepuzzle_submit( result ){
  //alert( '移動回数: ' + results.moves + '回, かかった時間: ' + results.seconds + '秒' );
  $('#__mycaptcha_time__').val( result.seconds );

  alert( __r[__OPTION.lang].congrats );
  $('#__original_html').removeClass( '__hide_first__' );
  $('#__mycaptcha_main_div__').addClass( '__hide_first__' );

  __submit_fire__ = true;
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


/*
 * jqPuzzle - Sliding Puzzles with jQuery
 * Version 1.02
 * 
 * Copyright (c) 2008 Ralf Stoltze, http://www.2meter3.de/jqPuzzle/
 * Dual-licensed under the MIT and GPL licenses.
 */
(function($){$.fn.jqPuzzle=function(settings,texts){var defaults={rows:4,cols:4,hole:16,shuffle:false,numbers:true,language:'en',control:{shufflePieces:true,confirmShuffle:true,toggleOriginal:true,toggleNumbers:true,counter:true,timer:true,pauseTimer:false},success:{fadeOriginal:true,callback:undefined,callbackTimeout:300},animation:{shuffleRounds:3,shuffleSpeed:800,slidingSpeed:200,fadeOriginalSpeed:600},style:{gridSize:2,overlap:true,backgroundOpacity:0.1}};var i18n={en:{shuffleLabel:'Shuffle',toggleOriginalLabel:'Original',toggleNumbersLabel:'Numbers',confirmShuffleMessage:'Do you really want to shuffle?',movesLabel:'moves',secondsLabel:'seconds'},fr:{shuffleLabel:'Mélanger',toggleOriginalLabel:'Original',toggleNumbersLabel:'Nombres',confirmShuffleMessage:'Veux-tu vraiment mélanger?',movesLabel:'mouvements',secondsLabel:'secondes'},de:{shuffleLabel:'Mischen',toggleOriginalLabel:'Original',toggleNumbersLabel:'Nummern',confirmShuffleMessage:'Willst du wirklich mischen?',movesLabel:'Züge',secondsLabel:'Sekunden'},pt:{shuffleLabel:'Embaralhar',toggleOriginalLabel:'Original',toggleNumbersLabel:'Numeros',confirmShuffleMessage:'Tem certeza que deseja reembralhar?',movesLabel:'movimentos',secondsLabel:'segundos'}};if(settings&&!settings.hole&&(settings.rows||settings.cols)){settings.hole=(settings.rows||defaults.rows)*(settings.cols||defaults.cols)}settings=$.extend(true,{},defaults,settings);texts=$.extend((i18n[settings.language]||i18n[defaults.language]),texts);var rows=settings.rows,cols=settings.cols,hole=settings.hole;var control=settings.control,success=settings.success,animation=settings.animation,style=settings.style;if(rows<3||rows>9)rows=defaults.rows;if(cols<3||cols>9)cols=defaults.rows;if((hole>(rows*cols))||(hole<1))hole=rows*cols;hole--;if(animation.slidingSpeed<1)animation.slidingSpeed=1;if(animation.shuffleSpeed<1)animation.shuffleSpeed=1;if(animation.fadeOriginalSpeed<1)animation.fadeOriginalSpeed=1;if(animation.shuffleRounds<1)animation.shuffleRounds=1;var checkSolution=function($pieces){for(var i=0;i<$pieces.length;i++){var pieceIndex=(i<hole)?i:i+1;if($pieces.eq(i).attr('current')!=pieceIndex)return false}return true};var checkOrder=function(numbersArray){var product=1;for(var i=1;i<=(rows*cols-1);i++){for(var j=(i+1);j<=(rows*cols);j++){product*=((numbersArray[i-1]-numbersArray[j-1])/(i-j))}}return Math.round(product)==1};var getLinearPosition=function(row,col){return parseInt(row)*cols+parseInt(col)};var getMatrixPosition=function(index){return{row:(Math.floor(index/cols)),col:(index%cols)}};var getBorderWidth=function($element){var property=$element.css('border-left-width');if($element.css('border-left-style')!='none'){switch(property){case'thin':return 2;case'medium':return 4;case'thick':return 6;default:return parseInt(property)||0}}return 0};var Timer=function(interval,callback){var startTime;var startPauseTime;var totalPause=0;var timeout;var run=function(){update(new Date().getTime());timeout=setTimeout(run,interval)};var update=function(now){callback(now-totalPause-startTime)};this.start=function(){if(startTime)return false;startTime=new Date().getTime();run()};this.stop=function(){if(!startTime)return false;clearTimeout(timeout);var now=new Date().getTime();if(startPauseTime)totalPause+=now-startPauseTime;update(now);startTime=startPauseTime=undefined;totalPause=0};this.pause=function(){if(!startTime||startPauseTime)return false;clearTimeout(timeout);startPauseTime=new Date().getTime()};this.resume=function(){if(!startPauseTime)return false;totalPause+=new Date().getTime()-startPauseTime;startPauseTime=undefined;run()}};return this.filter('img').each(function(){var $srcImg=$(this);var lock=false;var moves=0;var seconds=0;var solved;var shuffled=settings.shuffle;var timer;var currHole=hole;var $dummyPiece=$('<div/>').addClass('jqp-piece');var $dummyWrapper=$('<div/>').addClass('jqp-wrapper').append($dummyPiece);var $dummyGui=$('<div/>').attr('class',$srcImg.attr('class')||'').addClass('jqPuzzle').append($dummyWrapper);$srcImg.replaceWith($dummyGui);$dummyGui.attr('id',$srcImg.attr('id')||'');var computedStyles={gui:{border:getBorderWidth($dummyGui),padding:{left:parseInt($dummyGui.css('padding-left'))||0,right:parseInt($dummyGui.css('padding-right'))||0,top:parseInt($dummyGui.css('padding-top'))||0,bottom:parseInt($dummyGui.css('padding-bottom'))||0}},wrapper:{border:getBorderWidth($dummyWrapper),padding:parseInt($dummyWrapper.css('padding-left'))||0},piece:{border:getBorderWidth($dummyPiece)}};$dummyGui.removeAttr('id');$dummyGui.replaceWith($srcImg);$srcImg.one('load',function(){var overlap=(style.gridSize===0&&style.overlap);var coveredWidth=cols*(2*computedStyles.piece.border)+(cols-1)*style.gridSize;var coveredHeight=rows*(2*computedStyles.piece.border)+(rows-1)*style.gridSize;if(overlap){coveredWidth-=(cols-1)*computedStyles.piece.border;coveredHeight-=(rows-1)*computedStyles.piece.border}$srcImg.css({width:'auto',height:'auto',visibility:'visible'});var width=Math.floor(($srcImg.width()-coveredWidth)/cols);var height=Math.floor(($srcImg.height()-coveredHeight)/rows);if(width<30||height<30)return false;var fullWidth=cols*width+coveredWidth;var fullHeight=rows*height+coveredHeight;var imgSrc=$srcImg.attr('src');var totalPieceWidth=width+2*computedStyles.piece.border+style.gridSize;var totalPieceHeight=height+2*computedStyles.piece.border+style.gridSize;var boxModelHack={piece:$.boxModel?0:2*computedStyles.piece.border,wrapper:$.boxModel?0:2*(computedStyles.wrapper.border+computedStyles.wrapper.padding),gui:{width:$.boxModel?0:2*computedStyles.gui.border+computedStyles.gui.padding.left+computedStyles.gui.padding.right,height:$.boxModel?0:2*computedStyles.gui.border+computedStyles.gui.padding.top+computedStyles.gui.padding.bottom}};var getOffset=function(row,col){var offset={left:computedStyles.wrapper.padding+col*totalPieceWidth,top:computedStyles.wrapper.padding+row*totalPieceHeight};if(overlap){offset.left-=col*computedStyles.piece.border;offset.top-=row*computedStyles.piece.border}return offset};var shuffle=function(rounds,speed){if(speed){if($shuffleButton.is('.jqp-disabled'))return false;if(lock)return false;if(control.confirmShuffle&&(moves>0)&&!window.confirm(texts.confirmShuffleMessage))return false;lock=true;if(solved){$gui.removeClass('jqp-solved');$background.fadeTo(animation.fadeOriginalSpeed,style.backgroundOpacity,function(){$background.remove().prependTo($wrapper);$buttons.removeClass('jqp-disabled')})}}if(timer)timer.stop();solved=false;shuffled=true;moves=0;seconds=0;if($display)$display.removeClass('jqp-disabled');if($counter)$counter.val(moves);if($timer)$timer.val(seconds);var shuffles=[];var i=0;while(i<rounds){var choices=[];for(var j=0;j<rows*cols;j++){choices[j]=j}choices.splice(hole,1);shuffles[i]=[];for(var j=0;j<rows*cols;j++){if(j==hole){shuffles[i][j]=hole;continue}var randomIndex=Math.floor(Math.random()*choices.length);shuffles[i][j]=choices[randomIndex];choices.splice(randomIndex,1)}if(((i+1)<rounds)||checkOrder(shuffles[i]))i++}var animCounter=0;for(var i=0;i<rounds;i++){var lastRound=((i+1)==rounds);for(var j=0;j<shuffles[i].length;j++){if(j==hole){if(lastRound)currHole=hole;continue}var pieceIndex=shuffles[i][j];if(pieceIndex>hole)pieceIndex-=1;var $piece=$pieces.eq(pieceIndex);var target=getMatrixPosition(j);var offset=getOffset(target.row,target.col);if(lastRound)$piece.attr('current',j.toString());if(speed===undefined){$piece.css({left:offset.left,top:offset.top})}else{$piece.animate({left:offset.left,top:offset.top},speed,null,function(){animCounter++;if(animCounter==animation.shuffleRounds*(rows*cols-1)){lock=false;animCounter=0}})}}}};var $wrapper=$('<div/>').addClass('jqp-wrapper').css({width:fullWidth+boxModelHack.wrapper,height:fullHeight+boxModelHack.wrapper,borderWidth:computedStyles.wrapper.border,padding:computedStyles.wrapper.padding,margin:0,position:'relative',overflow:'hidden',display:'block',visibility:'inherit'});var $protoPiece=$('<div/>').addClass('jqp-piece').css({width:width+boxModelHack.piece,height:height+boxModelHack.piece,backgroundImage:'url('+imgSrc+')',borderWidth:computedStyles.piece.border,margin:0,padding:0,position:'absolute',overflow:'hidden',display:'block',visibility:'inherit',cursor:'default'}).append($('<span/>'));var $pieces=$([]);for(var i=0;i<rows;i++){for(var j=0;j<cols;j++){var index=getLinearPosition(i,j);if(index==hole)continue;var offset=getOffset(i,j);var bgLeft=-1*(j*totalPieceWidth+computedStyles.piece.border);var bgTop=-1*(i*totalPieceHeight+computedStyles.piece.border);if(overlap){bgLeft+=j*computedStyles.piece.border;bgTop+=i*computedStyles.piece.border}$pieces=$pieces.add($protoPiece.clone().css({left:offset.left,top:offset.top,backgroundPosition:(bgLeft+'px '+bgTop+'px')}).attr('current',String(index)).appendTo($wrapper).children().text(index+1).end())}}if(settings.shuffle)shuffle(1);var $background=$('<div/>').css({width:fullWidth,height:fullHeight,left:computedStyles.wrapper.padding,top:computedStyles.wrapper.padding,backgroundImage:'url('+imgSrc+')',borderWidth:0,margin:0,padding:0,position:'absolute',opacity:style.backgroundOpacity}).prependTo($wrapper);var $controls=$('<div/>').addClass('jqp-controls').css({visibility:'inherit',display:'block',position:'static'});var $shuffleButton,$originalButton,$numbersButton;var $protoButton=$('<a/>').css('cursor','default');if(control.shufflePieces){$shuffleButton=$protoButton.clone().text(texts.shuffleLabel).appendTo($controls)}if(control.toggleOriginal){$originalButton=$protoButton.clone().text(texts.toggleOriginalLabel).appendTo($controls)}if(control.toggleNumbers){$numbersButton=$protoButton.clone().text(texts.toggleNumbersLabel).appendTo($controls);if(settings.numbers)$numbersButton.addClass('jqp-toggle')}var $buttons=$controls.children();var $display,$counter,$timer;if(control.counter||control.timer){$display=$('<span/>').css('cursor','default').appendTo($controls);var $protoField=$('<input/>').val(0).css({width:'5ex',cursor:'default'}).attr('readonly','readonly');if(control.counter)$counter=$protoField.clone().appendTo($display).after(texts.movesLabel+' ');if(control.timer)$timer=$protoField.clone().appendTo($display).after(texts.secondsLabel);if(!settings.shuffle)$display.addClass('jqp-disabled')}var $credits=$('<a/>').text('jqPuzzle').attr('href','http://www.2meter3.de/jqPuzzle/').css({'float':'right',fontFamily:'Verdana, Arial, Helvetica, sans-serif',fontSize:'9px',lineHeight:'12px',textDecoration:'none',color:'#FFFFFF',backgroundColor:'#777777',backgroundImage:'none',borderBottom:'1px dotted #FFFFFF',padding:'1px 3px 2px',marginRight:computedStyles.wrapper.border,position:'static',display:'inline',visibility:'inherit'});var $panel=$('<div/>').css({width:fullWidth+2*(computedStyles.wrapper.padding+computedStyles.wrapper.border),position:'absolute',display:'block',visibility:'inherit',margin:'0px',padding:'0px',backgroundColor:'transparent'}).append($credits).append($controls);var $gui=$('<div/>').attr('class',$srcImg.attr('class')||'').addClass('jqPuzzle').css({width:fullWidth+2*(computedStyles.wrapper.padding+computedStyles.wrapper.border)+boxModelHack.gui.width,height:fullHeight+2*(computedStyles.wrapper.padding+computedStyles.wrapper.border)+boxModelHack.gui.height,textAlign:'left',overflow:'hidden',display:'block'}).append($wrapper).append($panel);$srcImg.replaceWith($gui);var id=$srcImg.attr('id');if(id)$gui.attr('id',id);if(!settings.numbers)$pieces.children().hide();if($display)$display.children('input').val(0);var guiHeight=$gui.height();var panelHeight=$panel.height();$gui.height($gui.height()+$panel.height());$gui.mousedown(function(){return false});$buttons.mousedown(function(){if(!$(this).is('.jqp-disabled'))$(this).addClass('jqp-down')});$buttons.mouseout(function(){$(this).removeClass('jqp-down')});$buttons.mouseup(function(){$(this).removeClass('jqp-down')});$pieces.click(function(){if(lock)return false;if(solved)return false;lock=true;var $piece=$(this);var current=$piece.attr('current');var source=getMatrixPosition(current);var dest=getMatrixPosition(currHole);if(Math.abs(source.row-dest.row)+Math.abs(source.col-dest.col)!=1){lock=false;return false}var offset=getOffset(dest.row,dest.col);$piece.attr('current',String(currHole));currHole=current;if(shuffled)moves++;if($counter)$counter.val(moves);if(moves==1){if(!timer)timer=new Timer(333,function(ms){seconds=Math.floor(ms/1000);if($timer)$timer.val(seconds)});timer.start()}$piece.animate({left:offset.left,top:offset.top},animation.slidingSpeed,null,function(){if(shuffled){solved=checkSolution($pieces);if(solved){if(timer)timer.stop();shuffled=false;$gui.addClass('jqp-solved');window.setTimeout(finishGame,100)}else lock=false}else lock=false})});if(control.shufflePieces)$shuffleButton.click(function(){shuffle(animation.shuffleRounds,animation.shuffleSpeed)});if(control.toggleOriginal)$originalButton.click(function(){if($originalButton.is('.jqp-disabled'))return false;if(lock)return false;lock=true;if($originalButton.is('.jqp-toggle')){if(control.shufflePieces)$shuffleButton.removeClass('jqp-disabled');if(control.toggleNumbers)$numbersButton.removeClass('jqp-disabled');$originalButton.removeClass('jqp-toggle');$background.fadeTo(animation.fadeOriginalSpeed,style.backgroundOpacity,function(){$(this).prependTo($wrapper);if(control.pauseTimer&&timer)timer.resume();lock=false})}else{if(control.shufflePieces)$shuffleButton.addClass('jqp-disabled');if(control.toggleNumbers)$numbersButton.addClass('jqp-disabled');$originalButton.addClass('jqp-toggle');if(control.pauseTimer&&timer)timer.pause();$background.appendTo($wrapper).fadeTo(animation.fadeOriginalSpeed,1,function(){lock=false})}return false});if(control.toggleNumbers)$numbersButton.click(function(){if($numbersButton.is('.jqp-disabled'))return false;if($numbersButton.is('.jqp-toggle')){$numbersButton.removeClass('jqp-toggle');$pieces.children().hide()}else{$numbersButton.addClass('jqp-toggle');$pieces.children().show()}});var finishGame=function(){if(success.fadeOriginal){if(control.toggleOriginal)$originalButton.addClass('jqp-disabled');if(control.toggleNumbers)$numbersButton.addClass('jqp-disabled');$background.appendTo($wrapper).fadeTo(animation.fadeOriginalSpeed,1.0,function(){lock=false;solutionCallback()})}else{lock=false;solutionCallback()}};var solutionCallback=function(){if($.isFunction(success.callback)){setTimeout(function(){success.callback({moves:moves,seconds:seconds})},success.callbackTimeout)}}});var interval=setInterval(function(){if($srcImg[0].complete){clearInterval(interval);$srcImg.trigger('load')}},333)}).end()};$(document).ready(function(){$('img.jqPuzzle').each(function(){var microFormat=/\bjqp(-[a-z]{2})?-r(\d)-c(\d)(-h(\d+))?(-s(\d+))?(-[A-Z]+)?\b/;var match=microFormat.exec(this.className);var settings;if(match){settings={rows:parseInt(match[2]),cols:parseInt(match[3]),hole:parseInt(match[5])||null,shuffle:match[8]&&match[8].indexOf('S')!=-1,numbers:match[8]?match[8].indexOf('N')==-1:true,language:match[1]&&match[1].substring(1)};if(match[7]){settings.animation={};settings.animation.shuffleRounds=parseInt(match[7])}if(match[8]&&match[8].search(/[ABCDE]/)!=-1){settings.control={};settings.control.shufflePieces=match[8].indexOf('A')==-1;settings.control.toggleOriginal=match[8].indexOf('B')==-1;settings.control.toggleNumbers=match[8].indexOf('C')==-1;settings.control.counter=match[8].indexOf('D')==-1;settings.control.timer=match[8].indexOf('E')==-1}}$(this).jqPuzzle(settings)})})})(jQuery);
