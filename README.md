# captcha.nsf


## Overview

Distributable Original Captcha Library


## Sample page

[Sample](https://dotnsf.github.io/captcha.nsf/)


## Usage

- Load jQuery(JS) and Bootstrap(JS,CSS) first,
  - `<script src="//code.jquery.com/jquery-2.2.4.min.js"></script>`
  - `<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.5.1/css/bootstrap.min.css" rel="stylesheet"/>`
  - `<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.5.1/js/bootstrap.min.js"></script>`

- Load JS and CSS of this captcha.nsf library,
  - `<script src="https://dotnsf.github.io/captcha.nsf/captcha.nsf.js"></script>`
  - `<link href="https://dotnsf.github.io/captcha.nsf/captcha.nsf.css" rel="stylesheet"/>`

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
  - `  $('#main-submit-button-div').mycaptcha( { mode: 'matchbo' } );`
  - `});`
  - `</script>`

  - `{ mode: 'modename' }`
    - `modename` can be `matchbo`(default) or `slizepuzzle`


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
<script src="https://dotnsf.github.io/captcha.nsf/captcha.nsf.js"></script>
<link href="https://dotnsf.github.io/captcha.nsf/captcha.nsf.css" rel="stylesheet"/>
  :
<script src="https://dotnsf.github.io/captcha.nsf/jquery.jqpuzzle.min.js"></script>
<link href="https://dotnsf.github.io/captcha.nsf/jquery.jqpuzzle.css" rel="stylesheet"/>
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
  $('#main-submit-button-div').mycaptcha( { mode: 'slidepuzzle' });
});
</script>
  :
```


## System specification

Matchbo-Captcha would post following extra information when sumitting. You can receive, save, and show those information if needed:

- `__mycaptcha_formula__` : resolved question(valid only in matchbo mode)
- `__mycaptcha_time__` : wasted seconds to resolve question



## Licensing

This code is licensed under MIT.


## Copyright

2024  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
