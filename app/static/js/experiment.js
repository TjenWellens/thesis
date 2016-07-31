/* global $:false */
$(document).ready(function () {
  $('#selectLanguage').change(function () {
    var language = $('#selectLanguage').val();
    var url = '/api/code/' + language;
    $.get(url, function (jsend) {
      if (!jsend.success === 'success') {
        console.log('Error with ajax call(' + url + '): ');
        console.log(jsend);
        alert('Error with ajax call(' + url + ')');
      }

      var lines = jsend.data.code;
      var code = '<p>' + lines.join('<br>') + '</p>';

      $('#code').html(code);
    });
  });
});