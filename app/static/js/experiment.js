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
  /**
   * set loading
   * do ajax call for snippet
   * set snippet
   */
  function refreshCodeSnippet () {
    var $code = $('#code');

    // show loading message
    snippetLoading();

    // get selected language
    var language = $('#selectLanguage').val();

    // create ajax call url
    var url = '/api/code/' + language;

    // do ajax call
    $.get(url, unwrapJsend(applySnippet));
  }

  /**
   * Show loading message in elements with class .snippet-loading
   */
  function snippetLoading () {
    $('.snippet-loading-message').html('Loading, please wait...');
    $('.snippet-loading-clear-val').val('');
  }

  /**
   * Set snippet content in elements that match the class
   */
  function applySnippet (snippet) {
    var code = '<p>' + snippet.code.join('<br>') + '</p>';

    var $code = $('.snippet-code');
    var $id = $('.snippet-id');
    var $inputArea = $('#codeInput');

    // code fragment
    $code.html(code);

    // id
    $id.val(snippet._id);

    // rows and cols
    $inputArea.attr('rows', snippet.rows);
    $inputArea.attr('cols', snippet.cols);
  }

  /**
   * success(jsend.data) if success
   */
  function unwrapJsend (success) {
    return function (jsend) {
      if (jsend.status !== 'success') {
        console.log('Error with ajax call(' + url + '): ');
        console.log(jsend);
        alert('Problem with fetching selected language, please try again or select another language');
        return;
      }

      success(jsend.data);
    }
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
        that  = this,
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
