# Matchbo-Captcha


## Overview

Distributable Matchbo-Captcha.JS


## Sample page

[Sample](https://dotnsf.github.io/matchbo-captcha/)


## Usage

- Load jQuery(JS) and Bootstrap(JS,CSS) first,
  - `<script src="//code.jquery.com/jquery-2.2.4.min.js"></script>`
  - `<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.5.1/css/bootstrap.min.css" rel="stylesheet"/>`
  - `<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.5.1/js/bootstrap.min.js"></script>`

- Load JS and CSS of this matchbo-captcha library,
  - `<script src="https://dotnsf.github.io/matchbo-captcha/matchbo-captcha.js"></script>`
  - `<link href="https://dotnsf.github.io/matchbo-captcha/matchbo-captcha.css" rel="stylesheet"/>`

- Wrap submit button(s) with ID,
  - Old:
    - `<button onClick="submitMessage();">Submit</button>`

  - New:
    - `<div id="main-submit-button-div">`
    - `<button onClick="submitMessage();">Submit</button>`
    - `</div>`

- And execute .matchbo() function.
  - `<script>`
  - `$(function(){`
  - `  $('#main-submit-button-div').matchbo();`
  - `});`
  - `</script>`


## Before & After

### Before

```
  :
  :
<textarea style="width:90%;height:200px;" id="main-textarea" class="form-control"></textarea>
<button class="btn btn-primary" onClick="submitMessage();">送信</button>
  :
  :
```

### After

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
<textarea style="width:90%;height:200px;" id="main-textarea" class="form-control"></textarea>
<div id="main-submit-button-div">
  <button class="btn btn-primary" onClick="submitMessage();">送信</button>
</div>
  :
  :
<script>
$(function(){
  $('#main-submit-button-div').matchbo();
});
</script>
  :
```


## System specification

Matchbo-Captcha would post following extra information when sumitting. You can receive, save, and show those information if needed:

- `__mycaptcha_formula__` : resolved question
- `__mycaptcha_time__` : wasted seconds to resolve question



## Licensing

This code is licensed under MIT.


## Copyright

2024  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
