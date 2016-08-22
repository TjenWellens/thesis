/* global $:false */

$(document).ready(function () {
  var viewTime = 3 * 60;
  var inputTime = 4 * 60;

  var countdownTimer;

  var state = {
    questions: startQuestions,
    explanation: startExperimentExplanation,
    view: startExperimentViewSnippet,
    reproduce: startExperimentInputSnippet,
    done: endExperiment,
  };

  $(document).delegate('textarea', 'keydown', changeTabToSpaces);

  //region State Transitions
  $('#questionsDoneButton').click(state.explanation);
  $('#startButton').click(state.view);
  $('#viewingDone').click(state.reproduce);
  $('#inputDone').click(state.done);

  function startQuestions () {
    $('#experiment').attr('style', 'display:none;');
    $('#viewSnippet').attr('style', 'display:none;');
    $('#inputSnippet').attr('style', 'display:none;');
    $('#questions').removeAttr('style');
  }

  function startExperimentExplanation () {
    $('#questions').attr('style', 'display:none;');
    $('#experiment').removeAttr('style');
  }

  function startExperimentViewSnippet () {
    $('#startViewing').val(new Date());
    $('#preExperiment').attr('style', 'display:none;');
    $('#viewSnippet').removeAttr('style');

    countdownTimer && countdownTimer.stop();
    countdownTimer = new CountDownTimer(viewTime)
      .onTick(updateCountDown)
      .onEnd(state.reproduce)
      .start();
  }

  function startExperimentInputSnippet () {
    $('#startInput').val(new Date().toISOString());
    $('#viewSnippet').attr('style', 'display:none;');
    $('#inputSnippet').removeAttr('style');

    countdownTimer && countdownTimer.stop();
    countdownTimer = new CountDownTimer(inputTime)
      .onTick(updateCountDown)
      .onEnd(state.done)
      .start();
  }

  function endExperiment () {
    countdownTimer && countdownTimer.stop();
    countdownTimer = null;
    $('#endInput').val(new Date().toISOString());
    // disable textarea
    $('#codeInput').attr('readonly', 'readonly');

    // post form
    $('#experimentForm').submit();
  }

  function updateCountDown (minutes, seconds) {
    $('.countdown').html(formatTime(minutes * 60 + seconds));
  }

  // also change on server!
  function formatTime (seconds) {
    var minutes = ((seconds / 60) | 0);
    var seconds = ((seconds % 60) | 0);
    minutes = '' + minutes;
    seconds = seconds < 10 ? '0' + seconds : '' + seconds;
    return '' + minutes + ':' + seconds;
  }

  //endregion

  //region CountDownTimer
  function CountDownTimer (duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.endFtns = [];
    this.running = false;
    this.timeoutId = null;
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
        that.timeoutId = setTimeout(timer, that.granularity);
      } else {
        diff = 0;
        that.running = false;
        that.endFtns.forEach(function (ftn) {
          ftn.call(this);
        }, that);
      }
    }());
    return this;
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

  CountDownTimer.prototype.stop = function () {
    clearTimeout(this.timeoutId);
  };

  CountDownTimer.parse = function (seconds) {
    return {
      'minutes': (seconds / 60) | 0,
      'seconds': (seconds % 60) | 0
    };
  };
  //endregion

  function changeTabToSpaces (e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode != 9) return;

    var $textarea = $(this);
    if (!$textarea.is('textarea')) {
      console.log('target not a textarea');
      return;
    }

    e.preventDefault();

    var text = $textarea.val();

    var value = '    ';
    var start = $(this).get(0).selectionStart;
    var end = $(this).get(0).selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    $textarea.val(
      text.substring(0, start)
      + value
      + text.substring(end)
    );

    // put caret at right position again
    $(this).get(0).selectionStart = start + value.length;
    $(this).get(0).selectionEnd = start + value.length;
  }
});
