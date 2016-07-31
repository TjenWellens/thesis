/* global $:false */
$(document).ready(function () {
  // listen to changes of selected language
  $('#selectLanguage').change(refreshCodeSnippet);

  // load default language
  refreshCodeSnippet();

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
});
