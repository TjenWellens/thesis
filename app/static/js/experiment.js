/* global $:false */
$(document).ready(function () {
  var viewTime = 2;
  var inputTime = 5;

  // listen to changes of selected language
  $('#selectLanguage').change(refreshCodeSnippet);

  // load default language
  refreshCodeSnippet();

  //region State Transitions
  $('#questionsDoneButton').click(startExperimentExplanation);
  $('#startButton').click(startExperimentViewSnippet);

  function startExperimentExplanation () {
    $('#questions').attr('style', 'display:none;');
    $('#experiment').removeAttr('style');
  }

  function startExperimentViewSnippet () {
    $('#preExperiment').attr('style', 'display:none;');
    $('#viewSnippet').removeAttr('style');

    new CountDownTimer(viewTime)
      .onTick(updateCountDown)
      .onEnd(startExperimentInputSnippet)
      .start();
  }

  function startExperimentInputSnippet () {
    $('#viewSnippet').attr('style', 'display:none;');
    $('#inputSnippet').removeAttr('style');

    new CountDownTimer(inputTime)
      .onTick(updateCountDown)
      .onEnd(endExperiment)
      .start();
  }

  function endExperiment () {
    // disable textarea
    $('#codeInput').attr('readonly', 'readonly');

    // post form
    $('#experimentForm').submit();
  }

  function updateCountDown (minutes, seconds) {
    $('#countdown').html('' + minutes + ':' + seconds);
  }

  //endregion

  //region refreshCodeSnippet()
  function refreshCodeSnippet () {
    var $code = $('#code');

    // show loading message
    $code.html('<p>Loading, please wait...</p>');

    // get selected language
    var language = $('#selectLanguage').val();

    // create ajax call url
    var url = '/api/code/' + language;

    // do ajax call
    $.get(url, function (jsend) {
      if (jsend.status !== 'success') {
        console.log('Error with ajax call(' + url + '): ');
        console.log(jsend);
        alert('Error with ajax call(' + url + ')');
        return;
      }

      insertSnippet($code, jsend.data);
      updateSize($('#codeInput'), jsend.data);
    });
  }

  function insertSnippet (element, snippet) {
    var lines = snippet.code;
    var code = '<p>' + lines.join('<br>') + '</p>';
    element.html(code);
  }

  function updateSize (element, snippet) {
    element.attr('rows', snippet.rows);
    element.attr('cols', snippet.cols);
  }

  //endregion

  //region CountDownTimer
  function CountDownTimer (duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.endFtns = [];
    this.running = false;
  }

  CountDownTimer.prototype.start = function () {
    if (this.running) {
      return;
    }
    this.running = true;
    var start = Date.now(),
      that = this,
      diff, obj;

    (function timer () {
      diff = that.duration - (((Date.now() - start) / 1000) | 0);

      obj = CountDownTimer.parse(diff);
      that.tickFtns.forEach(function (ftn) {
        ftn.call(this, obj.minutes, obj.seconds);
      }, that);

      if (diff > 0) {
        setTimeout(timer, that.granularity);
      } else {
        diff = 0;
        that.running = false;
        that.endFtns.forEach(function (ftn) {
          ftn.call(this);
        }, that);
      }
    }());
  };

  CountDownTimer.prototype.onTick = function (ftn) {
    if (typeof ftn === 'function') {
      this.tickFtns.push(ftn);
    }
    return this;
  };

  CountDownTimer.prototype.onEnd = function (ftn) {
    if (typeof ftn === 'function') {
      this.endFtns.push(ftn);
    }
    return this;
  };

  CountDownTimer.prototype.expired = function () {
    return !this.running;
  };

  CountDownTimer.parse = function (seconds) {
    return {
      'minutes': (seconds / 60) | 0,
      'seconds': (seconds % 60) | 0
    };
  };
  //endregion
});
