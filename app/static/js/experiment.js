/* global $:false */
$(document).ready(function () {
  var viewTime = 3 * 60;
  var inputTime = 5 * 60;

  var state = {
    questions: startQuestions,
    explanation: startExperimentExplanation,
    view: startExperimentViewSnippet,
    reproduce: startExperimentInputSnippet,
    done: endExperiment,
  };

  //region State Transitions
  $('#questionsDoneButton').click(state.explanation);
  $('#startButton').click(state.view);

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

    new CountDownTimer(viewTime)
      .onTick(updateCountDown)
      .onEnd(state.reproduce)
      .start();
  }

  function startExperimentInputSnippet () {
    $('#startInput').val(new Date().toISOString());
    $('#viewSnippet').attr('style', 'display:none;');
    $('#inputSnippet').removeAttr('style');

    new CountDownTimer(inputTime)
      .onTick(updateCountDown)
      .onEnd(state.done)
      .start();
  }

  function endExperiment () {
    $('#endInput').val(new Date().toISOString());
    // disable textarea
    $('#codeInput').attr('readonly', 'readonly');

    // post form
    $('#experimentForm').submit();
  }

  function updateCountDown (minutes, seconds) {
    $('#countdown').html('' + minutes + ':' + seconds);
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
