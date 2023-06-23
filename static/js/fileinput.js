$(document).ready(function() {
  $('#file').on('change', function(e) {
    var fileName = e.target.files[0].name;
    $('#filelabel span').text(fileName);
  });
});