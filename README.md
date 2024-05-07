# Matchbo-Captcha


## Overview

Distributable Matchbo-Captcha.JS


## Sample

[Sample](https://dotnsf.github.io/matchbo-captcha/)


## Usage

```
  :
<script src="//code.jquery.com/jquery-2.2.4.min.js"></script>
<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.5.1/css/bootstrap.min.css" rel="stylesheet"/>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.5.1/js/bootstrap.min.js"></script>
  :
<script src="https://dotnsf.github.io/matchbo-captcha/matchbo-captcha.js"></script>
<link href="https://dotnsf.github.io/matchbo-captcha/matchbo-captcha.css" rel="stylesheet"/>
  :
  :
<textarea style="width:90%;height:200px;" id="main-textarea"></textarea>
<div id="main-submit-button-div">
  <button class="btn btn-primary" onClick="submitMessage();">送信</button>
</div>
  :
  :
<script>
$(function(){
  $('#main-submit-button-div').matchbo({ extra: 'comment' });
});
</script>
  :
```


## Licensing

This code is licensed under MIT.


## Copyright

2024  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
